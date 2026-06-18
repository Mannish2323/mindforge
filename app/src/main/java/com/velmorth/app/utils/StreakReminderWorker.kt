package com.velmorth.app.utils

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.velmorth.app.MainActivity
import com.velmorth.app.data.local.PrefsManager
import java.time.LocalDate

/**
 * WorkManager worker that alerts the user in the evening if they haven't completed
 * their daily study check-in yet, protecting their active streak from breaking.
 */
class StreakReminderWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    companion object {
        const val CHANNEL_ID   = "velmorth_streak"
        const val CHANNEL_NAME = "Streak Protection"
        const val NOTIF_ID     = 1002
    }

    override suspend fun doWork(): Result {
        val prefs = PrefsManager(context)

        // If notifications or streak warnings are toggled off in settings, skip
        if (!prefs.notificationsEnabled || !prefs.streakAlertEnabled) {
            return Result.success()
        }

        // Get today's date in yyyy-MM-dd format
        val today = LocalDate.now().toString()
        val hasStudied = prefs.lastCheckinDate == today || prefs.dailyXpDate == today

        // Warn them if they have an active streak but haven't checked in yet today
        if (!hasStudied && prefs.streak > 0) {
            createNotificationChannel()
            showNotification(prefs.streak)
        }

        return Result.success()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH // High priority to alert user before streak breaks
            ).apply {
                description = "Warns you before your daily study streak breaks"
            }
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun showNotification(streakCount: Int) {
        val tapIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            setPackage(context.packageName)
        }
        val pendingIntent = PendingIntent.getActivity(
            context, 1, tapIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val content = "🔥 Don't lose your $streakCount-day streak! Practice for just 5 minutes to keep it alive before the day ends."

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("Streak at Risk! ⚠️")
            .setContentText(content)
            .setStyle(NotificationCompat.BigTextStyle().bigText(content))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIF_ID, notification)
    }
}
