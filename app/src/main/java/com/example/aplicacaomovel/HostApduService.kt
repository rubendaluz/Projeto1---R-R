package com.example.aplicacaomovel

import android.content.Intent
import android.nfc.cardemulation.HostApduService
import android.os.Bundle

class MyHostApduService : HostApduService() {
    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        val command = commandApdu?.toString(Charsets.UTF_8) ?: ""
        return handleCommand(command)
    }
        private fun handleCommand(command: String): ByteArray {
            // Implemente a lógica para processar o comando APDU recebido
            // Neste exemplo, assumimos que o comando contém o ID e o nome de usuário separados por ","
            val parts = command.split(",")
            if (parts.size == 2) {
                val userId = parts[0]
                val username = parts[1]

                // Agora você pode usar o ID e o nome de usuário conforme necessário
                // Por exemplo, envie uma mensagem, salve no banco de dados, etc.
                sendMessage("000", "Ruben")

                // Responda com uma mensagem de confirmação
                return "Mensagem Recebida".toByteArray(Charsets.UTF_8)
            } else {
                // Comando inválido
                return "Comando Inválido".toByteArray(Charsets.UTF_8)
            }
        }

        private fun sendMessage(userId: String, username: String) {
            // Implemente a lógica para enviar a mensagem
            // Neste exemplo, você pode usar Intents, Broadcasts, ou qualquer outra forma de comunicação
            // entre componentes da sua aplicação
            val intent = Intent("NFC_MESSAGE_RECEIVED")
            intent.putExtra("USER_ID", userId)
            intent.putExtra("USERNAME", username)
            sendBroadcast(intent)
        }

    override fun onDeactivated(reason: Int) {
        // Lógica para lidar com a desativação do serviço
    }
}