package com.example.aplicacaomovel

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import com.example.aplicacaomovel.Enteties.LoggedUser
import com.example.aplicacaomovel.api.EndPoints
import com.example.aplicacaomovel.api.LoginRequest
import com.example.aplicacaomovel.api.LoginResponse
import com.example.aplicacaomovel.api.ServiceBuilder
import com.example.aplicacaomovel.db.AppDatabase
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response




class MainActivity :  ComponentActivity() {
    private lateinit var  btnLogin: Button

    private lateinit var loginMessage: TextView


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)


        btnLogin = findViewById(R.id.btnLogin)
        val email = findViewById<EditText>(R.id.input_email).text.toString()
        Toast.makeText(this, email, Toast.LENGTH_SHORT).show()
       

        val  passwordEditTex = findViewById<EditText>(R.id.input_password)
        passwordEditTex.inputType = android.text.InputType.TYPE_CLASS_TEXT or
                android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
        val password =  passwordEditTex.text.toString()
        loginMessage = findViewById(R.id.loginMessage)


//        Função de Login
        btnLogin.setOnClickListener {
            loginMessage.text = " "
            loginMessage.visibility = View.GONE
            val request = ServiceBuilder.buildService(EndPoints::class.java)
            val loginRequest = LoginRequest(email, password)


            Toast.makeText(this, email, Toast.LENGTH_SHORT).show()
            Toast.makeText(this, password, Toast.LENGTH_SHORT).show()

            val call = request.loginUser(loginRequest)
            val intent = Intent(this, Home::class.java)
            startActivity(intent)
            call.enqueue(object : Callback<LoginResponse> {
                @SuppressLint("SetTextI18n")
                override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                    if (response.isSuccessful) {
                        val loginResponse = response.body()
                        loginResponse?.let {
                             val currentUser = LoggedUser(it.user.id, it.user.firstName, it.user.lastName, it.user.nfcTag, it.user.email)
                            // Save user to Room database
                            val loggedUserDao = AppDatabase.getInstance(applicationContext).loggedUserDao()
                            GlobalScope.launch {
                                loggedUserDao.insert(currentUser)
                            }
                        }
                        startActivity(intent)
                    } else {
                        loginMessage.visibility = View.VISIBLE
                        loginMessage.text = "Login Recusado. Verifique suas credenciais"
                    }
                }

                @SuppressLint("SetTextI18n")
                override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                    loginMessage.visibility = View.VISIBLE
                    loginMessage.text = "Network error"
                }
            })

//            startActivity(intent)

        }
    }
}




