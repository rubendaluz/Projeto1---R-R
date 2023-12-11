package com.example.aplicacaomovel

import android.nfc.cardemulation.HostApduService
import android.os.Bundle

class MyHostApduService : HostApduService() {

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        val command = commandApdu?.toString(Charsets.UTF_8) ?: ""
        val response = processCommand(command)

        return response.toByteArray(Charsets.UTF_8)
    }

    override fun onDeactivated(reason: Int) {
        // Lógica quando o serviço HCE é desativado
    }

    private fun processCommand(command: String): String {
        // Adicione aqui a lógica para processar os comandos APDU
        // e gerar respostas conforme necessário.
        // Exemplo simples: apenas retornar uma resposta fixa.

        return "Resposta do servidor para o comando: $command"
    }
}