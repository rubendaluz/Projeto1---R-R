package com.example.aplicacaomovel

import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.cardemulation.HostApduService
import android.os.Bundle
import android.widget.Toast

class MyHostApduService : HostApduService() {

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        // Verifique se commandApdu não é nulo
        if (commandApdu == null) {
            return ByteArray(0)
        }
        val userId = "999999" // Substitua por seu próprio identificador

        val tag = userId.toByteArray(Charsets.UTF_8) // Substitua por seu próprio identificador
        Toast.makeText(this, "${tag}", Toast.LENGTH_SHORT).show()
        return tag
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
