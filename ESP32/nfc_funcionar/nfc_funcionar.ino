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
const char *ssid = "Wifise";
const char *password = "12345678";



Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

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
    String uid = readNFCUID();
    delay(1000);
  if (!uid.isEmpty()) {
    // Handle the received data
    
    // nfcAuth(uid);
  }
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
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.print("Didn't find PN53x board");
  }else{
    Serial.println("Waiting for an NFC card...");
  }
  
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

void nfcAuth(const String &uid,const String &roomId) {
  String apiResponse = checkUserExistenceNFC(uid, roomId);

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

String checkUserExistenceNFC(const String &nfcTag, const String &roomId) {
  HTTPClient http;

  String verifyEndpoint = "https://192.168.170.94/api/user/authenticatenfc";
    
  // Substitua com o endereço do seu servidor e o endpoint
  http.begin(verifyEndpoint); 
  http.addHeader("Content-Type", "application/json");
  
  // Substitua com os valores reais
  String postData = "{\"roomId\":\"" + roomId + "\",\"nfcTag\":\"" + nfcTag + "\"}";
  
  int httpResponseCode = http.POST(postData);
  
  if (httpResponseCode > 0) {
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