package com.example.aplicacaomovel

import android.app.PendingIntent
import android.content.ComponentName
import android.content.Intent
import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.cardemulation.CardEmulation
import android.nfc.tech.Ndef
import android.nfc.tech.NdefFormatable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import android.widget.Toast
import androidx.activity.ComponentActivity

class Home :AppCompatActivity() {
//    private val nfcAdapter: NfcAdapter? by lazy {
//        NfcAdapter.getDefaultAdapter(this)
//    }

    //    NFC
    private var nfcAdapter: NfcAdapter? = null
    private var pendingIntent: PendingIntent? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        val btnPerfil = findViewById<ImageButton>(R.id.Perfil)

//      Ir para a pagina de perfil
        btnPerfil.setOnClickListener {
//            val intent = Intent(this, Perfil::class.java)
//            startActivity(intent)
        }

        //        NFC
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter == null) {
            Toast.makeText(this, "NFC não suportado neste dispositivo", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        pendingIntent = PendingIntent.getActivity(
            this, 0, Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0
        )

//         Verificar se o NFC está disponível
//        if (nfcAdapter == null) {
//            // NFC não disponível no dispositivo
//            // Lide com isso conforme necessário
//        } else {
//            // Inicializar e configurar o serviço de emulação de cartão
//            val componentName = ComponentName(this, MyHostApduService::class.java)
//            val intent = Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
//            val pendingIntent = PendingIntent.getActivity(this, 0, intent, 0)
//            nfcAdapter?.enableForegroundDispatch(this, pendingIntent, null, null)
//        }
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableForegroundDispatch(this, pendingIntent, null, null)
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleNfcIntent(intent)
    }

    private fun handleNfcIntent(intent: Intent) {
        val action = intent.action
        if (NfcAdapter.ACTION_NDEF_DISCOVERED == action || NfcAdapter.ACTION_TAG_DISCOVERED == action) {
            val tag: Tag? = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG)

            // Leitura da tag
            val messages: Array<NdefMessage?> = getNdefMessages(intent)
            for (message in messages) {
                for (record in message?.records.orEmpty()) {
                    val payload = record.payload
                    val text = String(payload)
                    // Processar o texto lido da tag conforme necessário
                    Toast.makeText(this, "Tag lida: $text", Toast.LENGTH_SHORT).show()
                }
            }

            // Escrita na tag (exemplo - substituir conforme necessário)
            if (tag != null) {
                writeNdefMessage(tag, "Dados a serem escritos na tag")
                Toast.makeText(this, "Dados escritos na tag", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun getNdefMessages(intent: Intent): Array<NdefMessage?> {
        val rawMessages = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES)
        return if (rawMessages != null) {
            Array(rawMessages.size) { i ->
                rawMessages[i] as NdefMessage
            }
        } else emptyArray()
    }

    private fun writeNdefMessage(tag: Tag, message: String) {
        val ndefRecord = NdefRecord.createTextRecord(null, message)
        val ndefMessage = NdefMessage(arrayOf(ndefRecord))

        val ndef: Ndef? = Ndef.get(tag)
        if (ndef != null) {
            ndef.connect()
            ndef.writeNdefMessage(ndefMessage)
            ndef.close()
        } else {
            val ndefFormatable: NdefFormatable? = NdefFormatable.get(tag)
            if (ndefFormatable != null) {
                ndefFormatable.connect()
                ndefFormatable.format(ndefMessage)
                ndefFormatable.close()
            }
        }
    }

//    override fun onResume() {
//        super.onResume()
//        // Configurar o serviço de emulação de cartão no modo de espera
//        // (processCommandApdu será chamado quando uma comunicação NFC for detectada)
//        val cardEmulation = CardEmulation.getInstance(nfcAdapter)
//        cardEmulation.setPreferredService(this, ComponentName(this, MyHostApduService::class.java))
//    }

//    override fun onPause() {
//        super.onPause()
//        // Desativar o modo de espera ao pausar a atividade
//        nfcAdapter?.disableForegroundDispatch(this)
//    }
}