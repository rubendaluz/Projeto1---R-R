package com.example.aplicacaomovel

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.activity.ComponentActivity




class MainActivity :  ComponentActivity() {
    private lateinit var  btnLogin: Button
    private lateinit var emailTextEdit: EditText
    private lateinit var passwordTextEdit: EditText
    private lateinit var loginMessage: TextView


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)


        btnLogin = findViewById(R.id.btnLogin)
        emailTextEdit = findViewById(R.id.input_email)
        val email = emailTextEdit.text.toString()
        passwordTextEdit = findViewById(R.id.input_password)
        // Configura o tipo de entrada como senha
        passwordTextEdit.inputType = android.text.InputType.TYPE_CLASS_TEXT or
                android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
        val password = passwordTextEdit.text.toString()
        loginMessage = findViewById(R.id.loginMessage)


//        Função de Login
        btnLogin.setOnClickListener {
//            loginMessage.text = " "
//            loginMessage.visibility = View.GONE
//            val request = ServiceBuilder.buildService(EndPoints::class.java)
//            val loginRequest = LoginRequest("user@example.com", "password123")
//            val call = request.loginUser(loginRequest)
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




