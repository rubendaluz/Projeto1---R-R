package com.example.aplicacaomovel

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.ComponentActivity
import com.example.aplicacaomovel.api.EndPoints
import com.example.aplicacaomovel.api.OutputPost
import com.example.aplicacaomovel.api.ServiceBuilder
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response




class MainActivity :  ComponentActivity() {
    private lateinit var  btnLogin: Button
    private lateinit var emailTextEdit: EditText
    private lateinit var passwordTextEdit: EditText


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


//        Função de Login
        btnLogin.setOnClickListener {
//            val request = ServiceBuilder.buildService(EndPoints::class.java)
//            val call = request.userLogin(email,password)
            val intent = Intent(this, Home::class.java)
            startActivity(intent)
//            call.enqueue(object:Callback<OutputPost>{
//                override fun onResponse(call: Call<OutputPost>, response: Response<OutputPost>) {
//                    if (response.isSuccessful){
//                        val c: OutputPost = response.body()!!

//                    }
//                }
//                override fun onFailure(call: Call<OutputPost>, t: Throwable) {
//                    Toast.makeText(this@MainActivity, "${t.message}", Toast.LENGTH_SHORT).show()
//                }
//            })
        }
    }
}




