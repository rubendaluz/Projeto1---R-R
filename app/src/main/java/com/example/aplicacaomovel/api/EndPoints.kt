package com.example.aplicacaomovel.api

import retrofit2.Call
import retrofit2.http.*
interface EndPoints {
    @POST("user/userlogin")
    fun loginUser(@Body loginRequest: LoginRequest): Call<LoginResponse>

    @GET("api/acesses/recent")
    fun recentAccess()
}