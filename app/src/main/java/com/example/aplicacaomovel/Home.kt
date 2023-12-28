package com.example.aplicacaomovel

import android.app.PendingIntent
import android.content.ComponentName
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.cardemulation.CardEmulation
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

class Home : AppCompatActivity() {
    private val nfcAdapter: NfcAdapter? by lazy {
        NfcAdapter.getDefaultAdapter(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
        // Verificar se o NFC está disponível
        if (nfcAdapter == null) {
            // NFC não disponível no dispositivo
            // Lide com isso conforme necessário
        } else {
            // Inicializar e configurar o serviço de emulação de cartão
            val componentName = ComponentName(this, MyHostApduService::class.java)
            val intent = Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            val pendingIntent = PendingIntent.getActivity(this, 0, intent, 0)
            nfcAdapter?.enableForegroundDispatch(this, pendingIntent, null, null)
        }
    }

    override fun onResume() {
        super.onResume()
        // Configurar o serviço de emulação de cartão no modo de espera
        // (processCommandApdu será chamado quando uma comunicação NFC for detectada)
        val cardEmulation = CardEmulation.getInstance(nfcAdapter)
        cardEmulation.setPreferredService(this, ComponentName(this, MyHostApduService::class.java))
    }

    override fun onPause() {
        super.onPause()
        // Desativar o modo de espera ao pausar a atividade
        nfcAdapter?.disableForegroundDispatch(this)
    }
}