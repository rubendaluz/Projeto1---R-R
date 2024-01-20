package com.example.aplicacaomovel

import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.util.Log
import android.widget.Toast

class MyHostApduService : HostApduService() {

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        if (commandApdu == null) {
            Log.d(TAG, "Command APDU is null")
            Toast.makeText(this, "Command APDU is null", Toast.LENGTH_SHORT).show()

            return ByteArray(0)
        }

        // Converta o comando APDU para uma string para facilitar a depuração
        val commandStr = String(commandApdu, Charsets.UTF_8)

        // Aqui você pode adicionar lógica para responder com os dados do usuário associado ao dispositivo
        val userId = "33" // Implemente sua lógica para obter o ID do usuário associado ao dispositivo

        Toast.makeText(this, "User ID associated with the device: $userId", Toast.LENGTH_SHORT).show()

        // Converta o ID do usuário em bytes e retorne como resposta
        return userId.toByteArray(Charsets.UTF_8)
    }

    companion object {
        private const val TAG = "MyHostApduService"
    }

    override fun onDeactivated(reason: Int) {
        // Chamado quando a comunicação NFC é encerrada
        // Você pode adicionar lógica adicional aqui, se necessário
        when (reason) {
            DEACTIVATION_LINK_LOSS -> {
                // Comunicação interrompida devido à perda de conexão
            }
            DEACTIVATION_DESELECTED -> {
                // O cartão foi desselecionado
            }
        }
    }
}
