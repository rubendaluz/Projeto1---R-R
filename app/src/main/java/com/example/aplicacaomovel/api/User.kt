package com.example.retrofit.api

data class User(
    val id: Int,
    val name: String,
    val email: String,
    val address: Address,
    val website: String,
    val company: Company
)
data class Address(
    val city: String,
    val zipcode: String,
    val geo: Geo
)
data class Geo (
    val lat: String,
    val lng: String
)

data class Company (
    val name: String,
    val bs: String
)