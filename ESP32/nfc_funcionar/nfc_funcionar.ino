#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_PN532.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Pins for NFC board
#define SDA_PIN 21
#define SCL_PIN 22


// WiFi Connection
const char *ssid = "Wifise";
const char *password = "12345678";

// const char* ssid = "MEO-564B00";      
// const char* password = "6ad9ca442b";

AsyncWebServer server(80);


String roomID = "1";

Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

void setup() {
  Serial.begin(115200);
  // Inicializar a comunicação I2C
  Wire.begin();
  setupWiFi();
  setupNFC();
  server.begin();
}

void loop() {
  String uid = readNFCUID();
  delay(1000);
  if (!uid.isEmpty()) {
    checkUserExistenceNFC(uid, roomID);
  }
}

void setupWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  // Imprimir o endereço IP local do ESP32
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void setupNFC() {
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.print("Didn't find PN53x board");
    while(1);  // Parar a execução se o leitor NFC não for encontrado
  }else{
    Serial.println("Waiting for an NFC card...");
    nfc.SAMConfig();
  }
  
}

String readNFCUID() {
  uint8_t uidLength;
  uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0};
  uint8_t card = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);


  if(card){
    Serial.println("Found an NFC card!");

    String uidString = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      uidString += String(uid[i], HEX);
    }
    
    printNfcData(uid, uidLength);
    // Exemplo de comando SELECT APDU para enviar
    uint8_t apdu[] = { 0x00, 0xA4, 0x04, 0x00, 0x07, 0xA0, 0x00, 0x00, 0x02, 0x47, 0x10, 0x01 };
    uint8_t response[255];
    uint8_t responseLength = sizeof(response);
    uint8_t success;

    success = nfc.inDataExchange(apdu, sizeof(apdu), response, &responseLength);

    if(success) {
      Serial.println("APDU command sent!");
      // Processar a resposta
      if (responseLength >= 2) {
          // Verificar os dois últimos bytes da resposta para o status word
          uint8_t sw1 = response[responseLength - 2];
          uint8_t sw2 = response[responseLength - 1];
          if (sw1 == 0x90 && sw2 == 0x00) {
              Serial.println("Comando executado com sucesso.");
          } else {
              Serial.print("Falha na execução do comando: SW=");
              Serial.print(sw1, HEX);
              Serial.println(sw2, HEX);
          }
      }
    } else {
      Serial.println("Failed to send APDU command.");
    }
    return uidString;
  }
  return "";
}

void printNfcData(uint8_t *uid, uint8_t uidLength) {
  String receivedData = "UID;";
  for (int i = 0; i < uidLength; i++) {
    receivedData += String(uid[i], HEX);
  }
  receivedData += ";";

  // Read the rest of the message until a newline character
  while (Serial.available() && Serial.peek() != '\n') {
    receivedData += char(Serial.read());
  }
  // Print the received data
  Serial.println("Received Data: " + receivedData);
}


String checkUserExistenceNFC(const String &nfcTag, const String &roomId) {
  HTTPClient http;

  String verifyEndpoint = "http://192.168.181.137:4242/api/user/authenticateNfc";
     

  http.begin(verifyEndpoint); 
  http.addHeader("Content-Type", "application/json");

  String postData = "{\"roomId\":\"" + roomId + "\",\"nfcTag\":\"" + nfcTag + "\"}";
  Serial.println(postData);

  int httpResponseCode = http.POST(postData);
  
  if (httpResponseCode == 200) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);

      // Analisar a resposta para verificar autorização e nome
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, response);
      bool authorized = doc["authorized"]; // Valor booleano de autorização
      const char* name = doc["name"]; // Nome do usuário

      if (authorized) {
        Serial.println("Acesso autorizado");
        Serial.print("Nome: ");
        Serial.println(name);
      } else {
        Serial.println("Acesso não autorizado");
      }
    } else {
      Serial.print("Erro ao enviar POST: ");
      Serial.println(httpResponseCode);
    }


  http.end();
}

