package com.velmorth.app.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun VelmorthMascot(
    animationRes: Int,
    speechBubbleText: String,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "mascot_float")
    val offsetY by infiniteTransition.animateFloat(
        initialValue = -5f,
        targetValue = 5f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = EaseInOutSine),
            repeatMode = RepeatMode.Reverse
        ),
        label = "offsetY"
    )

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        if (speechBubbleText.isNotEmpty()) {
            Box(
                modifier = Modifier
                    .padding(bottom = 12.dp)
                    .widthIn(max = 280.dp)
                    .shadow(4.dp, RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp))
                    .clip(RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp))
                    .background(Color(0xFFF1F8E9))
                    .border(1.5.dp, Color(0xFF81C784), RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp))
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = speechBubbleText,
                    color = Color(0xFF1B5E20),
                    style = MaterialTheme.typography.bodyMedium.copy(fontStyle = FontStyle.Italic),
                    textAlign = TextAlign.Center
                )
            }
        }

        Box(
            modifier = Modifier
                .offset(y = offsetY.dp)
                .size(100.dp)
                .background(
                    Brush.radialGradient(
                        colors = listOf(Color(0xFF81C784).copy(alpha = 0.4f), Color.Transparent)
                    ),
                    shape = CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(Color(0xFF81C784).copy(alpha = 0.15f), Color.Transparent)
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                val emoji = when (animationRes) {
                    1 -> "🦦"
                    2 -> "🦦✨"
                    3 -> "🦊💬"
                    else -> "🦊"
                }
                Text(
                    text = emoji,
                    fontSize = 36.sp
                )
            }
        }
    }
}
