package com.velmorth.app.ui.screens.aispeaker

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.velmorth.app.ui.components.VelmorthMascot

@Composable
fun AISpeakerScreen() {
    Column(
        modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.primaryContainer).padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Text("Velmorth AI Portal", style = MaterialTheme.typography.headlineMedium, color = MaterialTheme.colorScheme.onPrimaryContainer)
        
        VelmorthMascot(animationRes = 3, speechBubbleText = "Speak naturally, friend. I'm listening to your rhythm and phonics accent adjustments.")
        
        Card(modifier = Modifier.fillMaxWidth().height(120.dp)) {
            Box(Modifier.fillMaxSize().padding(16.dp), contentAlignment = Alignment.Center) {
                Text("Live Feedback Parsing System...", style = MaterialTheme.typography.bodyLarge)
            }
        }
        
        Button(
            onClick = {},
            modifier = Modifier.size(90.dp),
            shape = RoundedCornerShape(45.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
        ) {
            Text("🎙️", style = MaterialTheme.typography.headlineMedium)
        }
    }
}
