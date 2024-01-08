#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_PN532.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // Biblioteca para trabalhar com dados JSON

//Pins for NFC board
#define SDA_PIN 4  // Define the SDA pin
#define SCL_PIN 5  // Define the SCL pin

//Wifi Conection
const char *ssid = "SEU_SSID";
const char *password = "SUA_SENHA";

Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

// Set the I2C address (use the value printed on your LCD module)
int lcdAddress = 0x27;

// Set the LCD dimensions (columns x rows)
LiquidCrystal_I2C lcd(lcdAddress, 16, 2);

void setup() {
  Serial.begin(115200);
  connect_wifi();
  setup_nfc_board();
  setup_display_lcd();
}

void loop() {
  // Your main code goes here
}

void setup_nfc_board(){
  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1);
  }

  nfc.SAMConfig();
  Serial.println("Waiting for an NFC card ...");
}

bool nfc_auth(){
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
     Serial.println("Found an NFC card!");

    Serial.print("UID Length: "); Serial.print(uidLength, DEC); Serial.println(" bytes");
    Serial.print("UID Value: ");
    for (uint8_t i = 0; i < uidLength; i++) {
      Serial.print(" 0x"); Serial.print(uid[i], HEX);
    }
    Serial.println("");

    // Convert UID to a string
    String uidString = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      uidString += String(uid[i], HEX);
    }

    // Call API to check user existence and get user data
    String apiResponse = checkUserExistenceNFC(uidString);

    // Parse JSON response
    DynamicJsonDocument jsonDoc(1024);  // Adjust the size based on your expected JSON response size
    deserializeJson(jsonDoc, apiResponse);

    // Get user data from JSON
    String userName = jsonDoc["name"].as<String>();
    bool accessGranted = jsonDoc["accessGranted"];

    // Display user information on Serial Monitor
    Serial.print("User Name: "); Serial.println(userName);
    Serial.print("Access Granted: "); Serial.println(accessGranted ? "Yes" : "No");

    // Act based on access status
    if (accessGranted) {
      Serial.println("Access Granted!");
    } else {
      Serial.println("Access Denied!");
    }

    delay(5000);  // Wait for 5 seconds before checking the next card
  }
}

// Função que verifica se algum utilizador com aquele id exite na base de dados
String checkUserExistenceNFC(String uid) {
  HTTPClient http;

  // Substitua o URL com o endpoint real da sua API
  String apiUrl = "https://sua-api.com/checkuser?uid=" + uid;

  // Iniciar solicitação HTTP
  http.begin(apiUrl);

  // Obter o código de resposta
  int httpCode = http.GET();

  String response = "{}";  // Por padrão, retorna um objeto JSON vazio

  if (httpCode > 0) {
    Serial.printf("[HTTP] Código de resposta: %d\n", httpCode);

    if (httpCode == HTTP_CODE_OK) {
      // Resposta bem-sucedida, armazenar o corpo da resposta
      response = http.getString();
    }
  } else {
    Serial.printf("[HTTP] Falha na solicitação, código de erro: %s\n", http.errorToString(httpCode).c_str());
  }

  // Liberar recursos
  http.end();

  return response;
}

void setup_display_lcd(){
  // Initialize the LCD
  lcd.begin(16, 2);
  // Display a welcome message
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
