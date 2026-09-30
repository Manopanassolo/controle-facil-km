package br.com.controlefacil.km.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalGasStation
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Login
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material.icons.filled.Route
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import br.com.controlefacil.km.ui.theme.AppBackground
import br.com.controlefacil.km.ui.theme.BlueDark
import br.com.controlefacil.km.ui.theme.BlueLight
import br.com.controlefacil.km.ui.theme.BluePrimary
import br.com.controlefacil.km.ui.theme.CardWhite
import br.com.controlefacil.km.ui.theme.TextSecondary
import br.com.controlefacil.km.ui.theme.YellowAccent

private enum class AppScreen { AUTH, PLANS, HOME, NEW_TRIP }

@Composable
fun ControleFacilApp() {
    var screen by rememberSaveable { mutableStateOf(AppScreen.AUTH) }
    Surface(modifier = Modifier.fillMaxSize(), color = AppBackground) {
        when (screen) {
            AppScreen.AUTH -> AuthScreen { screen = AppScreen.PLANS }
            AppScreen.PLANS -> PlanScreen(
                onContinue = { screen = AppScreen.HOME },
                onBack = { screen = AppScreen.AUTH }
            )
            AppScreen.HOME -> HomeScreen { screen = AppScreen.NEW_TRIP }
            AppScreen.NEW_TRIP -> NewTripScreen(
                onBack = { screen = AppScreen.HOME },
                onSaved = { screen = AppScreen.HOME }
            )
        }
    }
}

@Composable
private fun BrandHeader() {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier.size(76.dp).background(BluePrimary, RoundedCornerShape(22.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Filled.Route, null, tint = YellowAccent, modifier = Modifier.size(42.dp))
        }
        Spacer(Modifier.height(14.dp))
        Text("Controle Fácil KM", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = BlueDark)
        Text("Seu KM e suas despesas sob controle.", style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
    }
}

@Composable
private fun AuthScreen(onContinue: () -> Unit) {
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 24.dp, vertical = 36.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        BrandHeader()
        Spacer(Modifier.height(34.dp))
        Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(20.dp)) {
                Text("Entrar", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(16.dp))
                Button(onClick = onContinue, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) {
                    Icon(Icons.Filled.Login, null); Spacer(Modifier.width(8.dp)); Text("Continuar com Google")
                }
                Spacer(Modifier.height(14.dp))
                Text("ou entre com seu e-mail", color = TextSecondary)
                Spacer(Modifier.height(10.dp))
                OutlinedTextField(email, { email = it }, Modifier.fillMaxWidth(), label = { Text("E-mail") }, singleLine = true)
                Spacer(Modifier.height(10.dp))
                OutlinedTextField(
                    password, { password = it }, Modifier.fillMaxWidth(), label = { Text("Senha") },
                    visualTransformation = PasswordVisualTransformation(), singleLine = true,
                    leadingIcon = { Icon(Icons.Filled.Lock, null) }
                )
                Spacer(Modifier.height(16.dp))
                Button(onClick = onContinue, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) { Text("Entrar") }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    TextButton(onClick = {}) { Text("Criar conta") }
                    TextButton(onClick = {}) { Text("Esqueci minha senha") }
                }
            }
        }
        Spacer(Modifier.height(18.dp))
        Text("Google é opcional. Você também poderá usar PIN ou biometria no aparelho.", color = TextSecondary, style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
private fun PlanScreen(onContinue: () -> Unit, onBack: () -> Unit) {
    var selected by rememberSaveable { mutableStateOf("free") }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp)) {
        IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Voltar") }
        Text("Escolha seu plano", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("Você pode mudar de plano depois.", color = TextSecondary)
        Spacer(Modifier.height(20.dp))
        PlanCard(selected == "free", { selected = "free" }, "Grátis", "R$ 0",
            listOf("Controle de viagens", "Controle de despesas", "1 veículo", "Histórico e relatórios básicos", "Uso offline"))
        Spacer(Modifier.height(14.dp))
        PlanCard(selected == "premium", { selected = "premium" }, "Premium", "Mais recursos",
            listOf("Vários veículos", "Mais recibos", "Relatórios avançados", "Exportações avançadas", "Agenda ampliada e backup"))
        Spacer(Modifier.height(22.dp))
        Button(
            onClick = onContinue, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)
        ) { Text("Continuar com " + if (selected == "free") "Grátis" else "Premium") }
    }
}

@Composable
private fun PlanCard(selected: Boolean, onClick: () -> Unit, title: String, price: String, features: List<String>) {
    Card(
        onClick = onClick,
        colors = CardDefaults.cardColors(containerColor = if (selected) BlueLight else CardWhite),
        border = if (selected) BorderStroke(2.dp, BluePrimary) else null,
        shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                RadioButton(selected = selected, onClick = onClick)
                Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Spacer(Modifier.weight(1f))
                Text(price, color = BluePrimary, fontWeight = FontWeight.Bold)
            }
            features.forEach { Text("• $it", Modifier.padding(start = 12.dp, top = 5.dp), color = TextSecondary) }
        }
    }
}

@Composable
private fun HomeScreen(onNewTrip: () -> Unit) {
    var tab by rememberSaveable { mutableStateOf(0) }
    val labels = listOf("Início", "Viagens", "Despesas", "Agenda", "Mais")
    val icons = listOf(Icons.Filled.Home, Icons.Filled.DirectionsCar, Icons.Filled.ReceiptLong, Icons.Filled.CalendarMonth, Icons.Filled.MoreHoriz)
    AppScaffold(tab, { tab = it }, labels, icons, onNewTrip) {
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp)) {
            Text("Olá!", style = MaterialTheme.typography.titleMedium, color = TextSecondary)
            Text("Seu controle de hoje", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(18.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                MetricCard("KM no período", "0 km", Icons.Filled.Map, Modifier.weight(1f))
                MetricCard("Despesas", "R$ 0,00", Icons.Filled.TrendingUp, Modifier.weight(1f))
            }
            Spacer(Modifier.height(10.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                MetricCard("Custo/KM", "R$ 0,00", Icons.Filled.LocalGasStation, Modifier.weight(1f))
                MetricCard("Viagens", "0", Icons.Filled.DirectionsCar, Modifier.weight(1f))
            }
            Spacer(Modifier.height(20.dp))
            Text("Ações rápidas", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(onClick = onNewTrip) { Icon(Icons.Filled.Add, null); Spacer(Modifier.width(6.dp)); Text("Nova viagem") }
                OutlinedButton(onClick = {}) { Icon(Icons.Filled.ReceiptLong, null); Spacer(Modifier.width(6.dp)); Text("Despesa") }
            }
            Spacer(Modifier.height(24.dp))
            Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp)) {
                    Text("Tudo sincronizado", fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(4.dp))
                    Text("Seus dados serão mantidos localmente e sincronizados quando houver conexão.", color = TextSecondary)
                }
            }
        }
    }
}

@Composable
private fun MetricCard(title: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector, modifier: Modifier) {
    Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(18.dp), modifier = modifier) {
        Column(Modifier.padding(16.dp)) {
            Icon(icon, null, tint = BluePrimary)
            Spacer(Modifier.height(10.dp))
            Text(title, color = TextSecondary, style = MaterialTheme.typography.bodySmall)
            Text(value, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleLarge)
        }
    }
}

@Composable
private fun AppScaffold(
    selected: Int,
    onSelected: (Int) -> Unit,
    labels: List<String>,
    icons: List<androidx.compose.ui.graphics.vector.ImageVector>,
    fab: () -> Unit,
    content: @Composable () -> Unit
) {
    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = fab, containerColor = YellowAccent) {
                Icon(Icons.Filled.Add, "Nova viagem", tint = BlueDark)
            }
        },
        bottomBar = {
            NavigationBar(containerColor = CardWhite) {
                labels.forEachIndexed { index, label ->
                    NavigationBarItem(
                        selected = selected == index, onClick = { onSelected(index) },
                        icon = { Icon(icons[index], null) }, label = { Text(label) }
                    )
                }
            }
        }
    ) { padding -> Box(Modifier.padding(padding)) { content() } }
}

@Composable
private fun NewTripScreen(onBack: () -> Unit, onSaved: () -> Unit) {
    var origin by rememberSaveable { mutableStateOf("") }
    var destination by rememberSaveable { mutableStateOf("") }
    var initialKm by rememberSaveable { mutableStateOf("") }
    var finalKm by rememberSaveable { mutableStateOf("") }
    var notes by rememberSaveable { mutableStateOf("") }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Voltar") }
            Text("Nova viagem", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }
        Column(Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) {
            Text("Dados da viagem", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(origin, { origin = it }, Modifier.fillMaxWidth(), label = { Text("Origem") })
            Spacer(Modifier.height(10.dp))
            OutlinedTextField(destination, { destination = it }, Modifier.fillMaxWidth(), label = { Text("Destino") })
            Spacer(Modifier.height(10.dp))
            OutlinedTextField(initialKm, { initialKm = it }, Modifier.fillMaxWidth(), label = { Text("KM inicial") })
            Spacer(Modifier.height(10.dp))
            OutlinedTextField(finalKm, { finalKm = it }, Modifier.fillMaxWidth(), label = { Text("KM final") })
            Spacer(Modifier.height(10.dp))
            OutlinedTextField(notes, { notes = it }, Modifier.fillMaxWidth(), minLines = 3, label = { Text("Observações") })
            Spacer(Modifier.height(20.dp))
            Card(colors = CardDefaults.cardColors(containerColor = BlueLight), shape = RoundedCornerShape(16.dp)) {
                Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Filled.DirectionsCar, null, tint = BluePrimary)
                    Spacer(Modifier.width(10.dp))
                    Text("O veículo padrão será usado. A seleção de veículos entra na próxima etapa.", color = BlueDark)
                }
            }
            Spacer(Modifier.height(22.dp))
            Button(onClick = onSaved, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) { Text("Salvar viagem") }
            Spacer(Modifier.height(30.dp))
        }
    }
}
