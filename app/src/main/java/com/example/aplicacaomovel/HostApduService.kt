package com.example.aplicacaomovel

import android.nfc.cardemulation.HostApduService
import android.os.Bundle

class MyHostApduService : HostApduService() {

    companion object {
        // Exemplo de AID. Você deve definir o AID que deseja usar.
        private val SELECT_AID_APDU = byteArrayOf(
            0x00.toByte(), // CLA
            0xA4.toByte(), // INS
            0x04.toByte(), // P1
            0x00.toByte(), // P2
            0x07.toByte(), // Lc
            0xA0.toByte(), 0x00.toByte(), 0x00.toByte(), 0x02.toByte(), 0x47.toByte(), 0x10.toByte(), 0x01.toByte() // AID
        )

        // Exemplo de resposta.
        private val SAMPLE_RESPONSE = "Hello from Card!".toByteArray()
    }

//    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
//        if (commandApdu == null) {
//            return ByteArray(0)
//        }
//
//        // Verifica se o APDU recebido é o comando SELECT AID.
//        if (commandApdu.contentEquals(SELECT_AID_APDU)) {
//            // Retorna uma resposta pré-definida.
//            return SAMPLE_RESPONSE
//        }
//
//        // Para outros comandos, retorna um status de erro.
//        return byteArrayOf(0x6F.toByte(), 0x00.toByte()) // SW1 SW2 (status words)
//    }

    override fun processCommandApdu(commandApdu: ByteArray?, extras: Bundle?): ByteArray {
        if (commandApdu == null) return byteArrayOf()

        // Exemplo: Verifique se o comando APDU é um comando de seleção (SELECT)
        val selectCommand = byteArrayOf(0x00.toByte(), 0xA4.toByte(), 0x04.toByte(), 0x00.toByte())
        if (commandApdu.sliceArray(0 until selectCommand.size).contentEquals(selectCommand)) {
            // Responda ao comando SELECT, por exemplo, com um status de sucesso
            return byteArrayOf(0x90.toByte(), 0x00.toByte()) // Status de sucesso
        }

        // Para outros comandos, retorne um status de erro ou uma resposta apropriada
        return byteArrayOf(0x6F.toByte(), 0x00.toByte()) // Status de erro genérico
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
