package br.com.controlefacil.km.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightScheme = lightColorScheme(
    primary = BluePrimary,
    onPrimary = CardWhite,
    primaryContainer = BlueLight,
    onPrimaryContainer = BlueDark,
    secondary = BlueDark,
    tertiary = YellowAccent,
    background = AppBackground,
    surface = CardWhite,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    error = Error
)

@Composable
fun ControleFacilTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightScheme,
        content = content
    )
}
