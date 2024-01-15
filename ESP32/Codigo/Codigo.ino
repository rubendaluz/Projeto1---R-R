#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_PN532.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Pins for NFC board
#define SDA_PIN 21
#define SCL_PIN 22

// Endereço I2C padrão para o módulo GeeekPi I2C 1602
#define I2C_ADDR 0x27

// Definir o número de colunas e linhas do LCD
#define LCD_COLUMNS 16
#define LCD_ROWS 2

// WiFi Connection
const char* ssid = "MEO-564B00";      // name of your WiFi network
const char* password = "6ad9ca442b";

const char* serverAddress = "http://192.168.1.189:4242";



Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);
// bool Adafruit_PN532::inDataExchange(uint8_t *send, uint8_t sendLength, uint8_t *response, uint8_t *responseLength)


int lcdAddress = 0x27;
LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLUMNS, LCD_ROWS);

void setup() {
  Serial.begin(115200);
  // Inicializar a comunicação I2C
  Wire.begin();
  // setupWiFi();
  setupNFC();
  // setupLCD();
}

void loop() {
  // uint8_t success;
  // uint8_t sendBuffer[] = { 0x00 }; // Buffer para enviar dados (ajuste conforme necessário)
  // uint8_t sendLength = sizeof(sendBuffer);
  // uint8_t responseBuffer[255];
  // uint8_t responseLength = sizeof(responseBuffer);

  // success = nfc.inListPassiveTarget(); // Procurar por cartões NFC

  // if (success) {
  //       success = nfc.inDataExchange(sendBuffer, sendLength, responseBuffer, &responseLength); // Trocar dados com o cartão
  //       if (success) {
  //           processNfcData(responseBuffer, responseLength);
  //       } else {
  //         Serial.println("Falha na troca de dados com o cartão NFC");
  //       }
  //     }

  String uid = readNFCUID();
  
  delay(1000);
}

void setupWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void setupNFC() {
  nfc.begin();
  nfc.SAMConfig();
  Serial.println("Waiting for an NFC card...");
}



String readNFCUID() {
  uint8_t uidLength;
  uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0};
  uint8_t card = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if(card){
    Serial.println("Found an NFC card!");
    Serial.print("UID Value: ");
    for (uint8_t i=0; i < uidLength; i++) {
      Serial.print(" 0x");Serial.print(uid[i], HEX);
    }
    Serial.println("");

    String uidString = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      uidString += String(uid[i], HEX);
    }
    
    
    Serial.print("UID Value: ");
    Serial.println(uidString);
    handleNfcData(uid, uidLength);
    return uidString;

  }
  return "";
}

void processNfcData(uint8_t* data, uint8_t length) {
        Serial.print("Dados em HEX: ");
    for (int i = 0; i < length; i++) {
        Serial.print(data[i], HEX);
        Serial.print(" ");
    }
    Serial.println("");

    String payload;
    for (int i = 0; i < length; i++) {
        if (isPrintable(data[i])) {
            payload += (char)data[i];
        } else {
            payload += String("[0x") + String(data[i], HEX) + "]";
        }
    }
    Serial.println("Payload: " + payload);
}

bool isPrintable(uint8_t c) {
    return c >= 32 && c <= 126;
}

void handleNfcData(uint8_t *uid, uint8_t uidLength) {
  // Your logic to handle the received NFC data goes here
  // Extract the UID, USER_ID, and USERNAME from the received data

  // Assuming the received data is formatted as "UID;USER_ID;USERNAME"
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

void nfcAuth(const String &uid) {
  String apiResponse = checkUserExistenceNFC(uid);

  DynamicJsonDocument jsonDoc(1024);
  deserializeJson(jsonDoc, apiResponse);

  String userName = jsonDoc["name"].as<String>();
  bool accessGranted = jsonDoc["accessGranted"];

  Serial.print("User Name: ");
  Serial.println(userName);
  Serial.print("Access Granted: ");
  Serial.println(accessGranted ? "Yes" : "No");

  if (accessGranted) {
    Serial.println("Access Granted!");
    // Imprimir no Display
  } else {
    Serial.println("Access Denied!");
    //Imprimir no display
  }
}

String checkUserExistenceNFC(const String &uid) {
  HTTPClient http;

  String apiUrl = String(serverAddress) + "/api/user/" + uid;

  if (http.begin(apiUrl)) {
    int httpCode = http.GET();

    if (httpCode == HTTP_CODE_OK) {
      return http.getString();
    } else {
      Serial.printf("[HTTP] Request failed, error code: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Failed to connect to API");
  }

  return "{}";
}

void setupLCD() {
  // Inicializar o LCD
  lcd.begin(LCD_COLUMNS, LCD_ROWS);
  // Limpar o LCD
  lcd.clear();
  lcd.print("Multiaccess");
}


void displayMessage(const char* message, int duration) {
  // Clear the LCD
  lcd.clear();
  // Display the message
  lcd.print(message);
  // Wait for the specified duration
  delay(duration);
  // Clear the LCD again
  lcd.clear();
}

void connect_wifi(){
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }

  Serial.println("Conectado ao WiFi");
}
