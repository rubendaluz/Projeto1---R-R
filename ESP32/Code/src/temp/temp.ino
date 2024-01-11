#include <Wire.h>
#include <Arduino.h>
#include <Preferences.h>

Preferences preferences;

bool isDeviceRegistered() {
  // Lê o valor nas preferências para verificar se o dispositivo está registrado
  return preferences.getBool("registered", false);
}

void setDeviceRegistered() {
  // Define o valor nas preferências para indicar que o dispositivo está registrado
  preferences.putBool("registered", true);
  preferences.end();
}

void showMainMenu() {
  Serial.println("===== MENU PRINCIPAL =====");
  Serial.println("1. Acessar Configurações");
  Serial.println("2. Gerenciar Usuários");
  Serial.println("==========================");
}

void showSettingsMenu() {
  Serial.println("===== MENU DE CONFIGURAÇÕES =====");
  Serial.println("1. Alterar ID da Sala");
  Serial.println("2. Alterar PIN Mestre");
  Serial.println("3. Sair do Menu de Configurações");
  Serial.println("===============================");
}

void showManageUserMenu() {
  Serial.println("===== GERENCIAR USUÁRIOS E IMPRESSÕES =====");
  Serial.println("Digite o ID do usuário:");
  while (!Serial.available());
  String userIDString = Serial.readStringUntil('\n');
  int userID = userIDString.toInt();

  if (userID > 0) {
    Serial.println("1. Adicionar Impressão Digital");
    Serial.println("2. Remover Impressão Digital");
    Serial.println("3. Outra opção...");
    Serial.println("===============================");
  } else {
    Serial.println("ID do usuário inválido!");
  }
}

void registerDevice() {
  Serial.println("===== REGISTRO DE DISPOSITIVO =====");

  Serial.println("Digite o ID da sala:");
  while (!Serial.available());
  String roomIDString = Serial.readStringUntil('\n');
  int roomID = roomIDString.toInt();

  Serial.println("Digite o PIN mestre (4 dígitos):");
  while (!Serial.available());
  String masterPINString = Serial.readStringUntil('\n');
  int masterPIN = masterPINString.toInt();

  // Realizar o processo de registro na base de dados aqui
  // (Você deve substituir isso pela lógica específica da sua aplicação)

  // Simulando o registro na base de dados (substitua pelo código real de comunicação com o banco de dados)
  Serial.println("Simulação: Registrando na base de dados...");

  // Aqui você teria a lógica real de registro na base de dados
  // Substitua isso com a sua lógica de comunicação com a base de dados

  // Simulando a impressão das informações relativas ao registro
  Serial.println("Simulação: Registro concluído com sucesso!");
  Serial.print("ID da Sala: ");
  Serial.println(roomID);
  Serial.print("Identificador Único do Dispositivo: ");
  uint64_t chipID = ESP.getEfuseMac();
  Serial.printf("%04X%08X\n", (uint16_t)(chipID >> 32), (uint32_t)chipID);
  Serial.print("PIN Mestre: ");
 

  // Salvar as informações nas preferências
  preferences.putInt("roomID", roomID);
  preferences.putInt("masterPIN", masterPIN);

  // Após o registro bem-sucedido, marcamos o dispositivo como registrado nas preferências
  setDeviceRegistered();

   preferences.end();
}
bool isDeviceRegistered() {
  // Lê o valor nas preferências para verificar se o dispositivo está registrado
  return preferences.getBool("registered", false);
}

void setDeviceRegistered() {
  // Define o valor nas preferências para indicar que o dispositivo está registrado
  preferences.putBool("registered", true);
  preferences.end();
}
void setup() {
  Serial.begin(115200);

  preferences.begin("registration", false);  // Nome do espaço de preferências

  if (isDeviceRegistered()) {
    // O dispositivo está registrado, permitir acesso normal
    Serial.println("Dispositivo registrado. Aguardando credenciais...");
    // Aqui você implementaria a lógica de obtenção de credenciais e verificação de acesso

      // Salvar as informações nas preferências
  preferences.remove("roomID");
  preferences.remove("masterPIN");

 preferences.putBool("registered", false);
  preferences.end();
  } else {
    // O dispositivo não está registrado, solicitar registro
    registerDevice();
  }
}

void loop() {
 if (digitalRead(15) == LOW) {
    // Botão pressionado, mostrar menu principal
    showMainMenu();

    // Aguarde a seleção do usuário
    while (!Serial.available());
    char menuOption = Serial.read();

    // Declara a variável settingsOption fora do switch
    char settingsOption;

    // Processar a opção do menu principal
    switch (menuOption) {
      case '1':
        // Acessar Configurações
        showSettingsMenu();

        // Aguarde a seleção do usuário no menu de configurações
        while (!Serial.available());
        settingsOption = Serial.read();

        // Processar a opção do menu de configurações
        switch (settingsOption) {
          case '1':
            // Implementar a lógica para alterar o ID da sala
            Serial.println("Simulação: Alterar ID da Sala");
            break;
          case '2':
            // Implementar a lógica para alterar o PIN mestre
            Serial.println("Simulação: Alterar PIN Mestre");
            break;
          case '3':
            // Sair do Menu de Configurações
            Serial.println("Saindo do Menu de Configurações");
            break;
          default:
            Serial.println("Opção inválida. Tente novamente.");
            break;
        }
        break;
      case '2':
        // Gerenciar Usuários
        showManageUserMenu();
        // Processar a lógica para gerenciar usuários
        // (Adicionar ou remover impressão digital, por exemplo)
        break;
      default:
        Serial.println("Opção inválida. Tente novamente.");
      break;
    }
  }

  // Seu código principal aqui
}
