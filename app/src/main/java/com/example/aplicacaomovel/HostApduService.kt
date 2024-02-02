package com.example.aplicacaomovel

import android.nfc.cardemulation.HostApduService
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import androidx.annotation.RequiresApi

@RequiresApi(Build.VERSION_CODES.KITKAT)
class MyHostApduService : HostApduService() {

    companion object {
        // AID para o aplicativo HCE. Deve corresponder ao AID configurado no apduservice.xml
        val SELECT_AID_APDU = byteArrayOf(
            0x00.toByte(), // CLA
            0xA4.toByte(), // INS: SELECT
            0x04.toByte(), // P1: Selecionar por nome
            0x00.toByte(), // P2
            0x07.toByte(), // LC: Comprimento do AID
            // AID: A0000002471001
            0xA0.toByte(), 0x00.toByte(), 0x00.toByte(), 0x02.toByte(), 0x47.toByte(), 0x10.toByte(), 0x01.toByte()
        )

        // Resposta de sucesso (pode ser personalizada conforme necessário)
        val SUCCESS_RESPONSE = byteArrayOf(0x90.toByte(), 0x00.toByte())
    }

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        if (commandApdu == null) {
            showToast("APDU recebido é nulo")
            return ByteArray(0)
        }

        showToast("APDU recebido: ${commandApdu.joinToString("") { "%02X".format(it) }}")

        // Verifica se o APDU recebido corresponde ao esperado
        if (commandApdu.contentEquals(SELECT_AID_APDU)) {
            showToast("APDU correspondente encontrado")
            return SUCCESS_RESPONSE
        }

        showToast("Comando APDU não suportado")
        return byteArrayOf(0x6A.toByte(), 0x82.toByte()) // SW para 'File not found' ou 'Comando não suportado'
    }

    override fun onDeactivated(reason: Int) {
        showToast("Comunicação NFC Desativada: Motivo $reason")
    }

    private fun showToast(message: String) {
        Handler(Looper.getMainLooper()).post {
            Toast.makeText(applicationContext, message, Toast.LENGTH_LONG).show()
        }
    }
}