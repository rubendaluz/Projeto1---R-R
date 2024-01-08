package com.example.aplicacaomovel

import android.app.PendingIntent
import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
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
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat


class Home : ComponentActivity() {

    private val NFC_PERMISSION_REQUEST = 1
    private val NFC_AID = "D2760000850101"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        val btnPerfil = findViewById<ImageButton>(R.id.Perfil)

        // Check and request NFC permissions
        checkNfcPermissions()

        // Set up NFC HCE service
        startNfcService()

        // Navigate to the profile page when the button is clicked
//        btnPerfil.setOnClickListener {
//            val intent = Intent(this, Perfil::class.java)
//            startActivity(intent)
//        }
    }

    private fun checkNfcPermissions() {
        // Check and request NFC permissions
        if (ContextCompat.checkSelfPermission(
                this,
                "android.permission.NFC"
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf("android.permission.NFC"),
                NFC_PERMISSION_REQUEST
            )
        } else {
            initializeNfc()
        }
    }

    private fun initializeNfc() {
        val nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        if (nfcAdapter == null) {
            // NFC is not available on this device
            // Handle accordingly
        } else {
            if (!nfcAdapter.isEnabled) {
                // NFC is not enabled, prompt user to enable it
                // You can show a dialog or navigate to NFC settings
            } else {
                // NFC is enabled, set up your HCE service
                startNfcService()
            }
        }
    }

    private fun startNfcService() {
        // Start your HCE service
        val intent = Intent(this, MyHostApduService::class.java)
        startService(intent)
    }
}

