package com.example.aplicacaomovel

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Spinner
import androidx.activity.ComponentActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.aplicacaomovel.Adapters.AccessListAdapter
import com.example.aplicacaomovel.Dataclasses.AccessItem
import com.example.aplicacaomovel.R

class Accesses : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_accesses)

        // Initialize and set up the date filter spinner
        val dateFilterSpinner = findViewById<Spinner>(R.id.dateFilterSpinner)
        val dateFilterAdapter = ArrayAdapter.createFromResource(
            this,
            R.array.date_filter_options,
            android.R.layout.simple_spinner_item
        )
        dateFilterAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        dateFilterSpinner.adapter = dateFilterAdapter

        // Initialize and set up the access type filter spinner
        val accessTypeFilterSpinner = findViewById<Spinner>(R.id.accessTypeFilterSpinner)
        val accessTypeFilterAdapter = ArrayAdapter.createFromResource(
            this,
            R.array.access_type_filter_options,
            android.R.layout.simple_spinner_item
        )
        accessTypeFilterAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        accessTypeFilterSpinner.adapter = accessTypeFilterAdapter

        val accessList = ArrayList<AccessItem>()
        // Populate accessList with your data
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", true))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", false))
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", true))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", false))
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", true))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", false))
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", true))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", false))

        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", false))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", true))
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", false))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", true))
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", false))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", true))
        accessList.add(AccessItem("NFC", "Room 1", "2024-01-08 20:08:13", false))
        accessList.add(AccessItem("Fingerprint", "Room 2", "2024-01-08 21:08:13", true))
        val adapter = AccessListAdapter(accessList)
        val recyclerView = findViewById<RecyclerView>(R.id.accessRecyclerView)
        recyclerView.adapter = adapter
        recyclerView.layoutManager = LinearLayoutManager(this)
    }
}
