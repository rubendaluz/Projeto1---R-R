package com.example.aplicacaomovel

//import android.nfc.NfcAdapter

import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.NfcAdapter
import android.nfc.NfcEvent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.app.ComponentActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.aplicacaomovel.Adapters.AccessListAdapter
import com.example.aplicacaomovel.Dataclasses.AccessItem
import com.example.aplicacaomovel.Enteties.LoggedUser
import com.example.aplicacaomovel.db.AppDatabase
import com.example.aplicacaomovel.db.LoggedUserRepository
import kotlinx.coroutines.launch


@SuppressLint("RestrictedApi")
class Home : ComponentActivity() {

    private val NFC_PERMISSION_REQUEST = 1
    private val NFC_AID = "D2760000850101"


    private lateinit var loggedUserRepository: LoggedUserRepository

    @SuppressLint("RestrictedApi")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)


        // Inicializar o repositório com o DAO
        val loggedUserDao = AppDatabase.getInstance(applicationContext).loggedUserDao()
        loggedUserRepository = LoggedUserRepository(loggedUserDao)

        lifecycleScope.launch {
            loggedUserRepository.loggedUser.collect { user ->
                user?.let {
                    updateUiWithLoggedUserInfo(it)
                }
            }
        }

        // Assuming you have a list of AccessItem
        val accessList = ArrayList<AccessItem>()
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", true))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", false))

        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", false))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", true))
        // Add mo
        val adapter = AccessListAdapter(accessList)
        val recyclerView = findViewById<RecyclerView>(R.id.recView)
        recyclerView.adapter = adapter
        recyclerView.layoutManager = LinearLayoutManager(this)


        val moreAcess = findViewById<TextView>(R.id.viewMoreText)
        moreAcess.setOnClickListener {
            val intent = Intent(this, Accesses::class.java)
            startActivity(intent)
        }

        val btnPerfil = findViewById<ImageButton>(R.id.Perfil)
        btnPerfil.setOnClickListener {
            val intent = Intent(this, Perfil::class.java)
            startActivity(intent)
        }
        // Check and request NFC permissions
        checkNfcPermissions()

        // Set up NFC HCE service
        startNfcService()
    }

    @SuppressLint("SetTextI18n")
    private fun updateUiWithLoggedUserInfo(user: LoggedUser){
        val userName: TextView = findViewById(R.id.textViewNome)
        val emailTextView: TextView = findViewById(R.id.textViewEmail)

        // Atualizar o nome do utilizador
        userName.text = user.firstName + " " + user.lastName
        // Atualizar o número de estudante
        emailTextView.text = user.email
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
                Toast.makeText(this, " not work", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "work", Toast.LENGTH_SHORT).show()
                startNfcService()
            }
        }
    }
    override fun onResume() {
        super.onResume()
        startNfcService()
    }

    private fun startNfcService() {
        // Start your HCE service
        val intent = Intent(this, MyHostApduService::class.java)
        startService(intent)
    }
}


