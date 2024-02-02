package com.example.aplicacaomovel

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity




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
<<<<<<< HEAD
//            loginMessage.text = " "
//            loginMessage.visibility = View.GONE
//            val request = ServiceBuilder.buildService(EndPoints::class.java)
//            val loginRequest = LoginRequest("user@example.com", "password123")
//            val call = request.loginUser(loginRequest)
=======
            loginMessage.text = " "
            loginMessage.visibility = View.GONE
            val request = ServiceBuilder.buildService(EndPoints::class.java)
            val loginRequest = LoginRequest(email, password)


            Toast.makeText(this, email, Toast.LENGTH_SHORT).show()
            Toast.makeText(this, password, Toast.LENGTH_SHORT).show()

            val call = request.loginUser(loginRequest)
>>>>>>> 8334c916c62db937002d884960407914d0cda2cc
            val intent = Intent(this, Home::class.java)
//            call.enqueue(object : Callback<LoginResponse> {
//                @SuppressLint("SetTextI18n")
//                override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
//                    if (response.isSuccessful) {
//                        val loginResponse = response.body()
//                        loginResponse?.let {
//                             val currentUser = LoggedUser(it.user.id, it.user.firstName, it.user.lastName, it.user.nfcTag, it.user.email)
//                            // Save user to Room database
//                            val loggedUserDao = AppDatabase.getInstance(applicationContext).loggedUserDao()
//                            GlobalScope.launch {
//                                loggedUserDao.insert(currentUser)
//                            }
//                        }
//                        startActivity(intent)
//                    } else {
//                        loginMessage.visibility = View.VISIBLE
//                        loginMessage.text = "Login Recusado. Verifique suas credenciais"
//                    }
//                }
//
//                @SuppressLint("SetTextI18n")
//                override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
//                    loginMessage.visibility = View.VISIBLE
//                    loginMessage.text = "Network error"
//                }
//            })

            startActivity(intent)

        }
    }
}




