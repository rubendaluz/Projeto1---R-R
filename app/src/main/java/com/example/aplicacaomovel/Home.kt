package com.example.aplicacaomovel

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.core.app.ComponentActivity
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

        // Configurar RecyclerView e adaptador para a lista de acessos
        setupAccessListRecyclerView()

        // Configurar botões e outros elementos de UI
        setupUiElements()
    }

    private fun setupAccessListRecyclerView() {
        val accessList = ArrayList<AccessItem>()

        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", true))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", false))

        val adapter = AccessListAdapter(accessList)
        val recyclerView = findViewById<RecyclerView>(R.id.recView)
        recyclerView.adapter = adapter
        recyclerView.layoutManager = LinearLayoutManager(this)
    }

    private fun setupUiElements() {
        val moreAccess = findViewById<TextView>(R.id.viewMoreText)
        moreAccess.setOnClickListener {
            val intent = Intent(this, Accesses::class.java)
            startActivity(intent)
        }

        val btnPerfil = findViewById<ImageButton>(R.id.Perfil)
        btnPerfil.setOnClickListener {
            val intent = Intent(this, Perfil::class.java)
            startActivity(intent)
        }
    }

    private fun updateUiWithLoggedUserInfo(user: LoggedUser) {
        val userName: TextView = findViewById(R.id.textViewNome)
        val emailTextView: TextView = findViewById(R.id.textViewEmail)
        userName.text = "${user.firstName} ${user.lastName}"
        emailTextView.text = user.email
    }
}


