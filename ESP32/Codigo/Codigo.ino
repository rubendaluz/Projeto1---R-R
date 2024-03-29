#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_PN532.h>
#include <Preferences.h>
#include <Adafruit_Fingerprint.h>
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
// const char* ssid = "MEO-564B00";      
// const char* password = "6ad9ca442b";

const char* ssid = "Wifise";      
const char* password = "12345678";

WiFiClient wclient;  // WiFi Client Object

const char* serverAddress = "http://192.168.170.94:4242";



Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);
// bool Adafruit_PN532::inDataExchange(uint8_t *send, uint8_t sendLength, uint8_t *response, uint8_t *responseLength)


int lcdAddress = 0x27;
LiquidCrystal_I2C lcd(I2C_ADDR, LCD_COLUMNS, LCD_ROWS);


HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

enum MenuState {
  MAIN_MENU,
  SETTINGS_MENU,
  MANAGE_USER_MENU
};

Preferences preferences;
MenuState currentMenu = MAIN_MENU;
bool isEditmode = false;
unsigned int counterID = 0;

// Protótipos das funções
void registerDevice();
void authenticateEditmode();
bool isDeviceRegistered();
void processUserInput();
void processMainMenuInput();
void processSettingsMenuInput();
void processManageUserMenuInput(int op);
void enrollFingerprint();
void verifyFingerprint();

void removeFingerprintFromUser(int userID);
void changeRoomID();
void changeMasterPIN();
bool authenticateMasterPIN();
int showMainMenu();
int showSettingsMenu();
int showManageUserMenu();

void setup() {
  Serial.begin(115200);
  pinMode(12, INPUT_PULLUP);                  // Botão conectado ao pino 12
  mySerial.begin(57600, SERIAL_8N1, 17, 16);  // Inicializa o sensor de impressão digital
  preferences.begin("registration", false);   // Nome do espaço de preferências
  // Inicializar a comunicação I2C
  Wire.begin();
  setupWiFi();
  setupNFC();
  // setupLCD();
  if (finger.verifyPassword()) {
    Serial.println("Sensor de impressão digital encontrado!");
  } else {
    Serial.println("Sensor de impressão digital não encontrado :(");
    while (1) { delay(1); }
  }
  if (!isDeviceRegistered()) {
    registerDevice();
  }
  preferences.end();

  preferences.begin("my-app", false);
  counterID = preferences.getUInt("counterID", 0);

  preferences.end();
}

void loop() {
  if (!isEditmode) {
    Serial.println("Coloque o dedo no sensor...");
    if (digitalRead(12) == LOW) {

      if (confirmMasterPIN()){
         isEditmode = true;
      } else{
        Serial.println("Pin incoreto");
      }
   
    }

    // String uid = readNFCUID();
 
    if (finger.getImage() == FINGERPRINT_OK) {
      verifyFingerprint();
    }

    delay(50);  // Pequena pausa para evitar sobrecarga do CPU

  } else {
    int op = -1;
    switch (currentMenu) {
      case MAIN_MENU:
        op = showMainMenu();
        processMainMenuInput(op);
        break;
      case SETTINGS_MENU:
        op = showSettingsMenu();
        processSettingsMenuInput(op);
        break;
      case MANAGE_USER_MENU:
        op = showManageUserMenu();
        processManageUserMenuInput(op);
        break;
    }
  }
  delay(1000);
}

void setupWiFi() {
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);              // Connects to WiFi Network
  while (WiFi.status() != WL_CONNECTED) {  // Waits for WiFi connection
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("ESP connected to WiFi with IP address: ");
  Serial.println(WiFi.localIP());
}

void setupNFC() {
  nfc.begin();
  nfc.SAMConfig();

  Serial.println("Waiting for an NFC card...");
}



String readNFCUID() {
  Serial.println("Found an NFC card!33");
  uint8_t uidLength;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  Serial.println("Found an NFC card!22");
  uint8_t card = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  Serial.println("Found an NFC card!11");
  if (!card) {
    return "";
  }
  Serial.println("Found an NFC card!");
  Serial.print("UID Value: ");
  for (uint8_t i = 0; i < uidLength; i++) {
    Serial.print(" 0x");
    Serial.print(uid[i], HEX);
  }
  Serial.println("");

    String uidString = "";
    for (uint8_t i = 0; i < uidLength; i++) {
      uidString += String(uid[i], HEX);
       Serial.println("bbb");
    }
    
    
    Serial.print("UID Value: ");
    Serial.println(uidString);
    return uidString;

  }
  return "";
}

void nfcAuth(const String &uid, const String &roomId) {
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

String checkUserExistenceNFC(const String &uid, const String &roomId) {

  String apiUrl = String(serverAddress) + "/api/user/authenticatenfc/" + uid;

    HTTPClient http;
    http.begin(apiUrl);  // Replace with your server's URL
    http.addHeader("Content-Type", "application/json");

    // Construct the JSON payload
    String payload = "{\"roomId\":\"" + roomId + "\",\"nfcTag\":\"" + uid + "\"}";

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
    } else {
        Serial.print("Error on sending POST: ");
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


// Fingerprint auth functions
void updateFingerprint(int userId, int fingerprintId) {
  String url = String(serverAddress) + "/api/user/updateFingerprint";
  String jsonPayload = "{\"userId\":" + String(userId) + ", \"fingerprintId\":" + String(fingerprintId) + "}";

  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode == 200) {
    Serial.println("Fingerprint updated successfully");
  } else {
    Serial.println("Failed to update fingerprint");
  }

  http.end();
}

bool authenticateUser(int fingerprintId, int roomId) {
  String url = String(serverAddress) + "/api/user/authenticate";
  String jsonPayload = "{\"fingerprintId\":" + String(fingerprintId) + ", \"roomId\":" + String(roomId) + "}";

  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode == 200) {
    Serial.println("User authenticated successfully");
    return true;
  } else {
    Serial.println("Authentication failed");
    return false;
  }

  http.end();
}

void clearAllFingerprints() {
  const int capacity = 270;  // Capacidade do sensor

  for (int id = 1; id <= capacity; id++) {
    if (finger.deleteModel(id) == FINGERPRINT_OK) {
      Serial.print("Impressão digital ID ");
      Serial.print(id);
      Serial.println(" deletada.");
    }
  }

  counterID = 0;

  preferences.begin("my-app", false);
  preferences.putUInt("counterID", counterID);
  preferences.end();
  Serial.println("Todas as impressões digitais foram removidas.");

  preferences.putInt("lastFingerprintID", counterID);  // Redefine o contador de ID

  // Envia a solicitação HTTP para atualizar todos os IDs de impressões digitais para nulo
  HTTPClient http;
  String url = String(serverAddress) + "api/user/updateAllFingerprints";
  http.begin(url);

  int httpResponseCode = http.PUT("null");

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.println("Falha na solicitação HTTP");
  }

  http.end();
}

void authenticateEditmode() {
  Serial.println("Modo de Edição ativado. Aguarde autenticação...");

  if (authenticateMasterPIN()) {
    isEditmode = true;
    Serial.println("Autenticação bem-sucedida. Modo de Edição ativado.");
  } else {
    Serial.println("Autenticação falhou. Tente novamente.");
  }
}

void processMainMenuInput(int userInput) {
  switch (userInput) {
    case 1:
      currentMenu = SETTINGS_MENU;
      break;
    case 2:
      currentMenu = MANAGE_USER_MENU;
      break;
    case 7:
      isEditmode = false;
      break;
    default:
      Serial.println("Opção inválida");
      break;
  }
}

void processSettingsMenuInput(int op) {

  char confirmation = '\0'; 
  switch (op) {
    case 1:
      changeRoomID();
      break;
    case 2:
      changeMasterPIN();
      break;
    case 3:
      Serial.println("Tem certeza de que deseja apagar todas as impressões digitais? (y/n)");
  while (confirmation != 'y' && confirmation != 'Y' && confirmation != 'n' && confirmation != 'N') {
        if (Serial.available() > 0) {
          confirmation = Serial.read();
        }
      }

      if (confirmation == 'y' || confirmation == 'Y') {
        clearAllFingerprints();
      } else {
        Serial.println("Operação cancelada.");
      }
      break;
    case 7:
      currentMenu = MAIN_MENU;
      break;
    default:
      Serial.println("Opção inválida");
      break;
  }
}

void processManageUserMenuInput(int op) {
  int userID = 0;
  switch (op) {
    case 1:
      Serial.println("Digite o ID do usuário:");
      while (userID == 0) {
        while (!Serial.available())
          ;
        userID = Serial.parseInt();
      }
      if (userID > 0) {
        enrollFingerprint(userID);
      } else {
        Serial.println("ID do usuário inválido!");
      }

      break;
    case 2:

      Serial.println("Digite o ID da impresao digital:");
      while (userID == 0) {
        while (!Serial.available())
          ;
        userID = Serial.parseInt();
      }
      if (userID > 0) {
        removeFingerprint(userID);
      } else {
        Serial.println("ID  inválido!");
      }
      break;
    case 7:
      currentMenu = MAIN_MENU;
      break;

    default:
      Serial.println("Comando inválido. Tente novamente.");
      break;
  }
}

void enrollFingerprint(int userId) {

  const char* enrollEndpoint = "http://192.168.170.94:4242/api/user/updateFingerprint";

  int id = getNextFingerprintID();  // Obtém o próximo ID disponível
  if (id < 0) {
    Serial.println("Nenhum espaço livre encontrado para armazenar impressão digital");
    return;
  }
  Serial.println("Aguardando dedo...");
  while (finger.getImage() != FINGERPRINT_OK) {
    delay(50);
  }

  // Converte imagem de impressão digital para caractéristicas e armazena em buffer 1
  finger.image2Tz(1);

  Serial.println("Remova o dedo");
  delay(2000);
  Serial.println("Coloque o mesmo dedo novamente");
  while (finger.getImage() != FINGERPRINT_OK) {
    delay(50);
  }

  // Converte a segunda imagem de impressão digital para características e armazena em buffer 2
  finger.image2Tz(2);

  // Combina as características dos buffers 1 e 2 e armazena o resultado no modelo
  if (finger.createModel() != FINGERPRINT_OK) {
    Serial.println("Erro ao criar modelo de impressão digital");
    return;
  }

 String payload = "{\"userId\":\"" + String(userId) + "\",\"fingerPrintId\":\"" + String(id) + "\"}";           
      

  // Make the HTTP request
  HTTPClient http;
  http.begin(enrollEndpoint);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int httpResponseCode = http.PUT(payload);

  if (httpResponseCode == 200) {
    if (finger.storeModel(id) == FINGERPRINT_OK) {
      Serial.println("Impressão digital armazenada com sucesso!");
      Serial.print("ID: ");
      Serial.println(id);
    } else {
      Serial.println("Erro ao armazenar impressão digital");
        counterID--;
    preferences.begin("my-app", false);
    preferences.putUInt("counterID", counterID);
    preferences.end();
    }
  } else {
    Serial.println("Failed to enroll fingerprint");
    Serial.print("HTTP response code: ");
    Serial.println(httpResponseCode);
     counterID--;
  preferences.begin("my-app", false);
    preferences.putUInt("counterID", counterID);
    preferences.end();
  }

  http.end();
}




int getNextFingerprintID() {

  const int capacity = 270;  // Capacidade do sensor

  if (counterID < capacity) {

    counterID++;  // Incrementa o ID para o próximo disponível
    preferences.begin("my-app", false);
    preferences.putUInt("counterID", counterID);
    preferences.end();
    return counterID;  // Retorna o próximo ID disponível
  }

  return -1;  // Retorna -1 se todos os IDs estiverem ocupados
}


void verifyFingerprint() {

  const char* verifyEndpoint = "http://192.168.170.94:4242/api/user/authenticate";
  const char* AcessEndpoint = "http://192.168.170.94:4242/api/acesses/create";

  Serial.println("Verificando....");

  // Converte a imagem de impressão digital para características e armazena no buffer 1
  if (finger.image2Tz(1) != FINGERPRINT_OK) {
    Serial.println("Erro ao converter imagem");
    return;
  }
  int roomId = 1;

  // Procura por uma impressão digital correspondente
  if (finger.fingerFastSearch() != FINGERPRINT_OK) {
    Serial.println("Impressão digital não encontrada");
 String payload = "{\"id_area\":\"" + String(roomId) + "\",\"metodo_auth\":\"fingerprint\",\"acesso_permitido\":\"false\"}";


    HTTPClient http;
    http.begin(AcessEndpoint);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    int httpResponseCode = http.POST(payload);
 
if (httpResponseCode != 200) {
      Serial.println("Erroe to save access");
    }

     http.end();
    return;
  }
  
// Prepare the payload for the HTTP request
String payload = "{\"roomId\":\"" + String(roomId) + "\",\"fingerPrintId\":\"" + String(finger.fingerID) + "\"}";


  // Make the HTTP request
  HTTPClient http;
  http.begin(verifyEndpoint);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int httpResponseCode = http.POST(payload);

  if (httpResponseCode == 200) {
    Serial.println("User authenticated successfully!");
    Serial.print("ID: ");
    Serial.println(finger.fingerID);
    Serial.print("Confiança: ");
    Serial.println(finger.confidence);
  } else if (httpResponseCode == 401) {
    Serial.println("Unauthorized access");
  } else {
    Serial.println("Failed to verify fingerprint");
    Serial.print("HTTP response code: "); Serial.println(httpResponseCode);
  }

  http.end();

}

void removeFingerprint(int fingerprintID) {
  if (fingerprintID <= 0 || fingerprintID > 270) {
    Serial.println("ID de impressão digital inválido.");
    return;
  }

  uint8_t deleteStatus = finger.deleteModel(fingerprintID);
  if (deleteStatus == FINGERPRINT_OK) {
    Serial.print("Impressão digital ID ");
    Serial.print(fingerprintID);
    Serial.println(" removida com sucesso.");
    // Aqui você pode adicionar lógica para atualizar as preferências, se necessário
  } else {
    Serial.print("Erro ao remover impressão digital ID ");
    Serial.println(fingerprintID);
  }
}

int showMainMenu() {
  Serial.println("======= MENU PRINCIPAL =======");
  Serial.println("  1. Acessar Configurações");
  Serial.println("  2. Gerenciar Usuários");
  Serial.println("  7. sair");
  Serial.println("==============================");
  int num = 0;
  while (num == 0) {
    while (!Serial.available())
      ;
    num = Serial.parseInt();
  }
  return num;
}

int showSettingsMenu() {
  Serial.println("===== MENU DE CONFIGURAÇÕES =====");
  Serial.println("  1. Alterar ID da Sala");
  Serial.println("  2. Alterar PIN Mestre");
  Serial.println("  7. voltar");
  Serial.println("===============================");

  int num = 0;
  while (num == 0) {
    while (!Serial.available())
      ;
    num = Serial.parseInt();
  }
  return num;
}

int showManageUserMenu() {
  Serial.println("====== GERENCIAR USUÁRIOS E IMPRESSÕES ======");
  Serial.println("  1. Adicionar Impressão Digital");
  Serial.println("  2. Remover Impressão Digital");
  Serial.println("  7. voltar");
  Serial.println("=============================================");
  int num = 0;
  while (num == 0) {
    while (!Serial.available())
      ;
    num = Serial.parseInt();
  }
  return num;
}

bool isDeviceRegistered() {
  return preferences.getBool("registered", false);
}

void setDeviceRegistered() {
  preferences.putBool("registered", true);
  preferences.end();
}



void registerDevice() {
  Serial.println("===== REGISTRO DE DISPOSITIVO =====");

  Serial.println("Digite o ID da sala:");
  while (!Serial.available())
    ;
  String roomIDString = Serial.readStringUntil('\n');
  int roomID = roomIDString.toInt();

  Serial.println("Digite o PIN mestre (4 dígitos):");
  while (!Serial.available())
    ;
  String masterPINString = Serial.readStringUntil('\n');
  int masterPIN = masterPINString.toInt();

  Serial.println("Simulação: Registrando na base de dados...");

  Serial.println("Simulação: Registro concluído com sucesso!");
  Serial.print("ID da Sala: ");
  Serial.println(roomID);
  Serial.print("Identificador Único do Dispositivo: ");
  uint64_t chipID = ESP.getEfuseMac();
  Serial.printf("%04X%08X\n", (uint16_t)(chipID >> 32), (uint32_t)chipID);
  Serial.print("PIN Mestre: ");

  preferences.putInt("roomID", roomID);
  preferences.putInt("masterPIN", masterPIN);

  setDeviceRegistered();
}

// Função para alterar o ID da Sala
void changeRoomID() {
  Serial.println("===== ALTERAR ID DA SALA =====");

  // Confirmar o PIN mestre antes de permitir a alteração
  if (confirmMasterPIN()) {
    Serial.println("Digite o novo ID da sala:");
    while (!Serial.available())
      ;
    String newRoomIDString = Serial.readStringUntil('\n');
    int newRoomID = newRoomIDString.toInt();

    // Faça o processamento necessário para alterar o ID da sala
    // Substitua esta parte pela lógica específica da sua aplicação

    Serial.println("Simulação: ID da sala alterado com sucesso!");
    Serial.print("Novo ID da Sala: ");
    Serial.println(newRoomID);
  } else {
    Serial.println("Confirmação do PIN mestre falhou. Ação cancelada.");
  }
}

// Função para alterar o PIN Mestre
void changeMasterPIN() {
  Serial.println("===== ALTERAR PIN MESTRE =====");

  // Confirmar o PIN mestre atual antes de permitir a alteração
  if (confirmMasterPIN()) {
    Serial.println("Digite o novo PIN mestre (4 dígitos):");
    while (!Serial.available())
      ;
    String newMasterPINString = Serial.readStringUntil('\n');
    int newMasterPIN = newMasterPINString.toInt();

    // Faça o processamento necessário para alterar o PIN mestre
    // Substitua esta parte pela lógica específica da sua aplicação

    Serial.println("Simulação: PIN mestre alterado com sucesso!");
  } else {
    Serial.println("Confirmação do PIN mestre falhou. Ação cancelada.");
  }
}

// Função para confirmar o PIN mestre atual
bool confirmMasterPIN() {




  Serial.println("Digite o PIN mestre  para confirmar:");

  int enteredPIN = 0;
  while (enteredPIN == 0) {
    while (!Serial.available())
      ;
    enteredPIN = Serial.parseInt();
  }

  preferences.begin("registration", false);
    int masterPIN = preferences.getInt("masterPIN", 0);

  preferences.end();

  return enteredPIN == masterPIN;
}
