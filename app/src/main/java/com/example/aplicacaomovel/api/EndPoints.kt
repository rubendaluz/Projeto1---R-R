package com.example.aplicacaomovel.api

import com.example.aplicacaomovel.api.User
import retrofit2.Call
import retrofit2.http.*
interface EndPoints {
    @POST("user/login")
    fun userLogin(@Field("username")username:String?,@Field("password")password:String?): Call<OutputPost>
    @POST("user/login")
    fun loginUser(@Body loginRequest: LoginRequest): Call<LoginResponse>
}