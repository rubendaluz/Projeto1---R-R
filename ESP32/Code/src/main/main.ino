#include <Wire.h>
#include <WiFi.h>  // Biblioteca WiFi do ESP32
#include <Arduino.h>
#include <Preferences.h>
#include <Adafruit_Fingerprint.h>
#include <HTTPClient.h>
#include <ESPAsyncWebServer.h>

const char* ssid = "Wifise";      // name of your WiFi network
const char* password = "12345678";  // password of the WiFi network
const char* serverAddress = "http://172.16.201.150:4242";
WiFiClient wclient;  // WiFi Client Object


AsyncWebServer server(8080);






HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

enum MenuState {
  MAIN_MENU,
  SETTINGS_MENU,
  MANAGE_USER_MENU
};
enum OperationMode {
  NORMAL_MODE,
  EDIT_MODE,
  WEB_ADD_FINGER_MODE,
  WEB_REMOVE_FINGER_MODE
};

OperationMode currentMode = NORMAL_MODE;

Preferences preferences;
MenuState currentMenu = MAIN_MENU;
bool isEditmode = false;
unsigned int counterID = 0;
int userIdWeb = -1;
int fingerIdWeb = -1;

// Protótipos das funções
void registerDevice();
void authenticateEditmode();
bool isDeviceRegistered();
void processUserInput();
void processMainMenuInput();
void processSettingsMenuInput();
void processManageUserMenuInput(int op);
void enrollFingerprint(int userId);
void verifyFingerprint();

void removeFingerprint(int fingerprintID);
void changeRoomID();
void changeMasterPIN();
bool authenticateMasterPIN();
int showMainMenu();
int showSettingsMenu();
int showManageUserMenu();

// Function prototypes
void handleRegisterFingerprint(AsyncWebServerRequest* request);
void handleRemoveFingerprint(AsyncWebServerRequest* request);
void updateFingerprint(int userId, int fingerprintId);
bool authenticateUser(int fingerprintId, int roomId);


void setup() {
  Serial.begin(115200);
  pinMode(12, INPUT_PULLUP);                  // Botão conectado ao pino 12
  mySerial.begin(57600, SERIAL_8N1, 17, 16);  // Inicializa o sensor de impressão digital
  preferences.begin("registration", false);   // Nome do espaço de preferências


  ///////////////////////////////////////////////////////
  // Connect to WiFi
  ///////////////////////////////////////////////////////
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

  ///////////////////////////////////////////////////////
  // running server
  ///////////////////////////////////////////////////////
  server.on("/finger/add", HTTP_GET, handleRegisterFingerprint);
  server.on("/finger/remove", HTTP_GET, handleRemoveFingerprint);
  server.begin();
  Serial.print("Server is running at http://");
  Serial.print(WiFi.localIP());
  Serial.print(":8080");




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
  Serial.println("Esperando por impressão digital válida...");


  preferences.begin("my-app", false);
  counterID = preferences.getUInt("counterID", 0);

  preferences.end();
}











void loop() {
  switch (currentMode) {
    case NORMAL_MODE:
      handleNormalMode();
      break;

    case EDIT_MODE:
      handleEditMode();
      break;

    case WEB_ADD_FINGER_MODE:
      handleWebAddFingerMode();
      break;

    case WEB_REMOVE_FINGER_MODE:
      handleWebRemoveFingerMode();
      break;
  }

  delay(1000);
}

void handleNormalMode() {
  Serial.println("Coloque o dedo no sensor...");

  if (digitalRead(12) == LOW) {
    if (confirmMasterPIN()) {
      currentMode = EDIT_MODE;
    
    } else {
      Serial.println("Pin incorreto");
    }
  } else {
    if (finger.getImage() == FINGERPRINT_OK) {
        verifyFingerprint();
      }
  }

  

  delay(50);  // Pequena pausa para evitar sobrecarga do CPU
}

void handleEditMode() {
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

void handleWebAddFingerMode() {
  enrollFingerprint(userIdWeb);
  
  currentMode = NORMAL_MODE; 
  userIdWeb = -1;
}

void handleWebRemoveFingerMode() {
  
    removeFingerprint(fingerIdWeb);
    int num = -1;
     updateFingerprint( userIdWeb, num);
    currentMode = NORMAL_MODE; 
    fingerIdWeb = -1;
    userIdWeb = -1;

}






///////////////////////////////////////////////////////
//  server controlers
///////////////////////////////////////////////////////

void handleRegisterFingerprint(AsyncWebServerRequest* request) {
  userIdWeb = request->arg("userId").toInt();
  currentMode = WEB_ADD_FINGER_MODE;

  // Cria um objeto AsyncWebServerResponse
  AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", "Fingerprint registration started successfully.");
  
  // Adiciona o cabeçalho CORS ao objeto de resposta
  response->addHeader("Access-Control-Allow-Origin", "*");

  // Envia a resposta
  request->send(response);
}
void handleRemoveFingerprint(AsyncWebServerRequest* request) {
  fingerIdWeb  = request->arg("fingerprintID").toInt();
  userIdWeb =  request->arg("userId").toInt();
  currentMode = WEB_REMOVE_FINGER_MODE;
    AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", "Fingerprkkkkkkint registration started successfully.");
  
  // Adiciona o cabeçalho CORS ao objeto de resposta
  response->addHeader("Access-Control-Allow-Origin", "*");

  // Envia a resposta
  request->send(response);


  
}




void updateFingerprint(int userId, int fingerprintId) {
  const char* enrollEndpoint = "http://172.16.201.150:4242/api/user/updateFingerprint";
  String payload = "{\"userId\":\"" + String(userId) + "\",\"fingerPrintId\":\"" + String(fingerprintId) + "\"}";
  HTTPClient http;
  http.begin(enrollEndpoint);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int httpResponseCode = http.PUT(payload);


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
  String url = "http://172.16.201.150:4242/api/user/updateAllFingerprints";
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

void  enrollFingerprint(int userId) {

  const char* enrollEndpoint = "http://172.16.201.150:4242/api/user/updateFingerprint";

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

  const char* verifyEndpoint = "http://172.16.201.150:4242/api/user/authenticate";
  const char* AcessEndpoint = "http://172.16.201.150:4242/api/acesses/create";

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
      Serial.println("Error to save access");
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
    Serial.print("HTTP response code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void removeFingerprint(int fingerprintID) {
  if (fingerprintID <= 0 || fingerprintID > 270) {
    Serial.println("Invalid fingerprint ID.");
    return ;
  }

  uint8_t deleteStatus = finger.deleteModel(fingerprintID);
  if (deleteStatus == FINGERPRINT_OK) {
    Serial.print("Fingerprint ID ");
    Serial.print(fingerprintID);
    Serial.println(" removed successfully.");
    // Add logic to update preferences if necessary
    return;
  } else {
    Serial.print("Error removing fingerprint ID ");
    Serial.println(fingerprintID);
    return;
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
