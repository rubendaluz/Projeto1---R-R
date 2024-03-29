package com.example.aplicacaomovel.api

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
object ServiceBuilder {
    private val client = OkHttpClient.Builder().build()
    private val retrofit = Retrofit.Builder().baseUrl("http://192.168.1.189:4242/api/").addConverterFactory(GsonConverterFactory.create()).client(client)
        .build()
    fun<T> buildService(service: Class<T>): T{
        return retrofit.create(service) }
}
