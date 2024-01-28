package com.example.aplicacaomovel.api

import retrofit2.Call
import retrofit2.http.*
interface EndPoints {
    @POST("user/login")
    fun loginUser(@Body loginRequest: LoginRequest): Call<LoginResponse>
}