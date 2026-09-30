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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.remember
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.ui.platform.LocalContext
import br.com.controlefacil.km.core.local.TripLocalRepository
import br.com.controlefacil.km.core.local.ExpenseLocalRepository
import br.com.controlefacil.km.core.local.ExpenseCategoryLocalRepository
import br.com.controlefacil.km.core.local.AttachmentLocalRepository
import br.com.controlefacil.km.core.local.ReceiptLocalFileStore
import br.com.controlefacil.km.core.model.Attachment
import br.com.controlefacil.km.auth.SupabaseAuthRepository
import br.com.controlefacil.km.auth.SupabaseClientProvider
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import br.com.controlefacil.km.core.model.ExpensePayment
import br.com.controlefacil.km.core.local.VehicleLocalRepository
import br.com.controlefacil.km.core.model.Trip
import br.com.controlefacil.km.core.model.TripStatus
import br.com.controlefacil.km.core.rules.VehicleSelectionRules
import java.time.LocalDate
import java.util.UUID
import br.com.controlefacil.km.core.rules.TripRules
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
import br.com.controlefacil.km.sync.SyncScheduler
import br.com.controlefacil.km.sync.SyncStatusStore
import br.com.controlefacil.km.sync.SyncUiState

private enum class AppScreen { AUTH, PLANS, HOME, TRIPS, EXPENSES, NEW_TRIP, CALENDAR, VEHICLES }

@Composable
fun ControleFacilApp() {
    var screen by rememberSaveable { mutableStateOf(AppScreen.AUTH) }
    val context = LocalContext.current
    val vehicleRepository = remember { VehicleLocalRepository(context) }
    val tripRepository = remember { TripLocalRepository(context) }
    val expenseRepository = remember { ExpenseLocalRepository(context) }
    val expenseCategoryRepository = remember { ExpenseCategoryLocalRepository(context) }
    val attachmentRepository = remember { AttachmentLocalRepository(context) }
    LaunchedEffect(Unit) { expenseCategoryRepository.seedDefaultsIfEmpty() }
    Surface(modifier = Modifier.fillMaxSize(), color = AppBackground) {
        when (screen) {
            AppScreen.AUTH -> AuthScreen(
                repository = SupabaseAuthRepository(),
                onAuthenticated = { screen = AppScreen.PLANS }
            )
            AppScreen.PLANS -> PlanScreen(
                onContinue = { screen = AppScreen.HOME },
                onBack = { screen = AppScreen.AUTH }
            )
            AppScreen.HOME -> HomeScreen(
                onNewTrip = { screen = AppScreen.NEW_TRIP },
                onTrips = { screen = AppScreen.TRIPS },
                onExpenses = { screen = AppScreen.EXPENSES },
                onCalendar = { screen = AppScreen.CALENDAR },
                onVehicles = { screen = AppScreen.VEHICLES },
                tripRepository = tripRepository,
                expenseRepository = expenseRepository
            )
            AppScreen.TRIPS -> TripsScreen(
                vehicleRepository = vehicleRepository,
                tripRepository = tripRepository,
                onBack = { screen = AppScreen.HOME },
                onNewTrip = { screen = AppScreen.NEW_TRIP }
            )
            AppScreen.EXPENSES -> ExpenseScreen(
                vehicleRepository = vehicleRepository,
                expenseRepository = expenseRepository,
                categoryRepository = expenseCategoryRepository,
                attachmentRepository = attachmentRepository,
                onBack = { screen = AppScreen.HOME }
            )
            AppScreen.NEW_TRIP -> NewTripScreen(
                vehicleRepository = vehicleRepository,
                tripRepository = tripRepository,
                onBack = { screen = AppScreen.HOME },
                onSaved = { screen = AppScreen.HOME }
            )
            AppScreen.VEHICLES -> VehicleScreen(
                repository = vehicleRepository,
                onBack = { screen = AppScreen.HOME }
            )
            AppScreen.CALENDAR -> CalendarScreen(
                onBack = { screen = AppScreen.HOME }
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
private fun AuthScreen(repository: SupabaseAuthRepository, onAuthenticated: () -> Unit) {
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    var signUpMode by rememberSaveable { mutableStateOf(false) }
    var displayName by rememberSaveable { mutableStateOf("") }
    var error by rememberSaveable { mutableStateOf<String?>(null) }
    var loading by rememberSaveable { mutableStateOf(false) }
    val scope = androidx.compose.runtime.rememberCoroutineScope()
    LaunchedEffect(Unit) {
        if (repository.currentUser() != null) onAuthenticated()
        SupabaseClientProvider.client.auth.sessionStatus.collect { status ->
            if (status is SessionStatus.Authenticated) onAuthenticated()
        }
    }
    Column(
        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 24.dp, vertical = 36.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        BrandHeader()
        Spacer(Modifier.height(34.dp))
        Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(20.dp)) {
                Text(if (signUpMode) "Criar conta" else "Entrar", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(16.dp))
                Button(onClick = { scope.launch { loading = true; error = null; repository.signInWithGoogle().onFailure { error = it.message }; loading = false } }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp), enabled = !loading) {
                    Icon(Icons.Filled.Login, null); Spacer(Modifier.width(8.dp)); Text("Continuar com Google")
                }
                Spacer(Modifier.height(14.dp))
                Text(if (signUpMode) "Cadastre-se com seu e-mail" else "ou entre com seu e-mail", color = TextSecondary)
                Spacer(Modifier.height(10.dp))
                if (signUpMode) { OutlinedTextField(displayName, { displayName = it }, Modifier.fillMaxWidth(), label = { Text("Nome") }, singleLine = true); Spacer(Modifier.height(10.dp)) }
                OutlinedTextField(email, { email = it }, Modifier.fillMaxWidth(), label = { Text("E-mail") }, singleLine = true)
                Spacer(Modifier.height(10.dp))
                OutlinedTextField(
                    password, { password = it }, Modifier.fillMaxWidth(), label = { Text("Senha") },
                    visualTransformation = PasswordVisualTransformation(), singleLine = true,
                    leadingIcon = { Icon(Icons.Filled.Lock, null) }
                )
                Spacer(Modifier.height(16.dp))
                Button(onClick = { scope.launch { loading = true; error = null; val result = if (signUpMode) repository.signUp(email, password, displayName) else repository.signIn(email, password); result.onSuccess { if (!signUpMode || it != null) onAuthenticated() else error = "Cadastro criado. Confirme seu e-mail para entrar." }.onFailure { error = it.message ?: "Não foi possível concluir a autenticação." }; loading = false } }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp), enabled = !loading) { Text(if (signUpMode) "Criar conta" else "Entrar") }
                error?.let { Text(it, color = androidx.compose.ui.graphics.Color(0xFFF04438), style = MaterialTheme.typography.bodySmall); Spacer(Modifier.height(8.dp)) }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    TextButton(onClick = { signUpMode = !signUpMode; error = null }) { Text(if (signUpMode) "Já tenho conta" else "Criar conta") }
                    if (!signUpMode) TextButton(onClick = {}) { Text("Esqueci minha senha") }
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
private fun HomeScreen(onNewTrip: () -> Unit, onTrips: () -> Unit, onExpenses: () -> Unit, onCalendar: () -> Unit, onVehicles: () -> Unit, tripRepository: TripLocalRepository, expenseRepository: ExpenseLocalRepository) {
    var tab by rememberSaveable { mutableStateOf(0) }
    val trips = remember { tripRepository.list() }
    val totalKm = trips.sumOf { it.distanceM ?: 0L }
    val completedTrips = trips.count { it.status == TripStatus.COMPLETED }
    val expenses = remember { expenseRepository.list() }
    val totalExpensesCents = expenses.sumOf { it.amountCents }
    val syncState = remember { SyncStatusStore(context).get() }
    val labels = listOf("Início", "Viagens", "Despesas", "Agenda", "Mais")
    val icons = listOf(Icons.Filled.Home, Icons.Filled.DirectionsCar, Icons.Filled.ReceiptLong, Icons.Filled.CalendarMonth, Icons.Filled.MoreHoriz)
    AppScaffold(tab, { selected ->
        tab = selected
        when (selected) {
            1 -> onTrips()
            3 -> onCalendar()
            4 -> onVehicles()
        }
    }, labels, icons, onNewTrip) {
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp)) {
            Text("Olá!", style = MaterialTheme.typography.titleMedium, color = TextSecondary)
            Text("Seu controle de hoje", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(18.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                MetricCard("KM no período", "$totalKm km", Icons.Filled.Map, Modifier.weight(1f))
                MetricCard("Despesas", "R$ %.2f".format(java.util.Locale("pt", "BR"), totalExpensesCents / 100.0), Icons.Filled.TrendingUp, Modifier.weight(1f))
            }
            Spacer(Modifier.height(10.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                MetricCard("Custo/KM", "R$ 0,00", Icons.Filled.LocalGasStation, Modifier.weight(1f))
                MetricCard("Viagens", "$completedTrips", Icons.Filled.DirectionsCar, Modifier.weight(1f))
            }
            Spacer(Modifier.height(20.dp))
            Text("Ações rápidas", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(onClick = onNewTrip) { Icon(Icons.Filled.Add, null); Spacer(Modifier.width(6.dp)); Text("Nova viagem") }
                OutlinedButton(onClick = onExpenses) { Icon(Icons.Filled.ReceiptLong, null); Spacer(Modifier.width(6.dp)); Text("Despesa") }
            }
            Spacer(Modifier.height(24.dp))
            Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp)) {
                    Text(
                        when (syncState) {
                            SyncUiState.OFFLINE -> "Sem conexão — dados salvos no aparelho"
                            SyncUiState.PENDING -> "Aguardando sincronização"
                            SyncUiState.SYNCING -> "Sincronizando..."
                            SyncUiState.SYNCED -> "Tudo sincronizado"
                            SyncUiState.ERROR -> "Sincronização com erro"
                        },
                        fontWeight = FontWeight.Bold,
                        color = if (syncState == SyncUiState.ERROR) androidx.compose.ui.graphics.Color(0xFFF04438) else BlueDark
                    )
                    Spacer(Modifier.height(4.dp))
                    Text("Seus dados são mantidos localmente e sincronizados quando houver conexão.", color = TextSecondary)
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
private fun NewTripScreen(
    vehicleRepository: VehicleLocalRepository,
    tripRepository: TripLocalRepository,
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val appContext = LocalContext.current
    var origin by rememberSaveable { mutableStateOf("") }
    var destination by rememberSaveable { mutableStateOf("") }
    var initialKm by rememberSaveable { mutableStateOf("") }
    var finalKm by rememberSaveable { mutableStateOf("") }
    val vehicles = remember { vehicleRepository.listActive() }
    var selectedVehicleId by rememberSaveable { mutableStateOf(VehicleSelectionRules.initialSelection(vehicles)) }
    var notes by rememberSaveable { mutableStateOf("") }
    var errorMessage by rememberSaveable { mutableStateOf<String?>(null) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Voltar") }
            Text("Nova viagem", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }
        Column(Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) {
            Text("Veículo", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            if (vehicles.isEmpty()) {
                Card(colors = CardDefaults.cardColors(containerColor = BlueLight), shape = RoundedCornerShape(16.dp)) {
                    Text("Cadastre pelo menos um veículo em Mais antes de criar uma viagem.", Modifier.padding(16.dp), color = BlueDark)
                }
            } else {
                vehicles.forEach { vehicle ->
                    OutlinedButton(
                        onClick = { selectedVehicleId = vehicle.id },
                        modifier = Modifier.fillMaxWidth(),
                        border = if (selectedVehicleId == vehicle.id) BorderStroke(2.dp, BluePrimary) else null
                    ) {
                        Text(if (vehicle.plate.isNullOrBlank()) vehicle.name else vehicle.name + " • " + vehicle.plate)
                    }
                    Spacer(Modifier.height(6.dp))
                }
            }
            Spacer(Modifier.height(12.dp))
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
            errorMessage?.let {
                Text(it, color = androidx.compose.ui.graphics.Color(0xFFF04438), style = MaterialTheme.typography.bodySmall)
                Spacer(Modifier.height(8.dp))
            }
            Card(colors = CardDefaults.cardColors(containerColor = BlueLight), shape = RoundedCornerShape(16.dp)) {
                Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Filled.DirectionsCar, null, tint = BluePrimary)
                    Spacer(Modifier.width(10.dp))
                    Text("O veículo padrão será usado. A seleção de veículos entra na próxima etapa.", color = BlueDark)
                }
            }
            Spacer(Modifier.height(22.dp))
            Button(
                onClick = {
                    val inicial = initialKm.toLongOrNull()
                    val final = finalKm.toLongOrNull()
                    val validation = TripRules.validateOdometers(inicial, final)
                    if (selectedVehicleId == null) {
                        errorMessage = "Selecione um veículo antes de salvar a viagem."
                    } else if (validation.valid && inicial != null) {
                        errorMessage = null
                        tripRepository.save(
                            Trip(
                                id = UUID.randomUUID().toString(),
                                vehicleId = selectedVehicleId!!,
                                tripDate = LocalDate.now().toString(),
                                startOdometerM = inicial,
                                endOdometerM = final,
                                origin = origin.trim().takeIf { it.isNotEmpty() },
                                destination = destination.trim().takeIf { it.isNotEmpty() },
                                notes = notes.trim().takeIf { it.isNotEmpty() },
                                status = if (final != null) TripStatus.COMPLETED else TripStatus.DRAFT
                            )
                        )
                        SyncScheduler.requestNow(appContext)
                        onSaved()
                    } else {
                        errorMessage = validation.message
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            ) { Text("Salvar viagem") }
            Spacer(Modifier.height(30.dp))
        }
    }
}

@Composable
private fun ExpenseScreen(
    vehicleRepository: VehicleLocalRepository,
    expenseRepository: ExpenseLocalRepository,
    categoryRepository: ExpenseCategoryLocalRepository,
    attachmentRepository: AttachmentLocalRepository,
    onBack: () -> Unit
) {
    val appContext = LocalContext.current
    val scope = androidx.compose.runtime.rememberCoroutineScope()
    val vehicles = remember { vehicleRepository.listActive() }
    val categories = remember { categoryRepository.listActive() }
    var selectedVehicleId by rememberSaveable { mutableStateOf(VehicleSelectionRules.initialSelection(vehicles)) }
    var selectedCategoryId by rememberSaveable { mutableStateOf(categories.firstOrNull()?.id.orEmpty()) }
    var description by rememberSaveable { mutableStateOf("") }
    var amount by rememberSaveable { mutableStateOf("") }
    var merchant by rememberSaveable { mutableStateOf("") }
    var odometer by rememberSaveable { mutableStateOf("") }
    var payment by rememberSaveable { mutableStateOf(ExpensePayment.PIX) }
    var error by rememberSaveable { mutableStateOf<String?>(null) }
    var version by rememberSaveable { mutableStateOf(0) }
    var receiptUri by rememberSaveable { mutableStateOf<String?>(null) }
    var receiptName by rememberSaveable { mutableStateOf<String?>(null) }
    val receiptPicker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            val result = withContext(Dispatchers.IO) {
                ReceiptLocalFileStore.copyToPrivateStorage(appContext, uri)
            }
            result.onSuccess { stored ->
                receiptUri = stored.localUri
                receiptName = stored.originalFilename
                error = null
            }.onFailure {
                receiptUri = null
                receiptName = null
                error = it.message ?: "Não foi possível armazenar o comprovante."
            }
        }
    }
    val categoryNames = remember(categories) { categories.associate { it.id to it.name } }
    val expenses = remember(version) { expenseRepository.list().sortedByDescending { it.expenseDate } }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Voltar") }
            Text("Despesas", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(12.dp))
        if (vehicles.isEmpty()) {
            Card(colors = CardDefaults.cardColors(containerColor = BlueLight), shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
                Text("Cadastre um veículo antes de lançar uma despesa.", Modifier.padding(18.dp), color = BlueDark)
            }
        } else {
            Text("Veículo", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(6.dp))
            vehicles.forEach { vehicle ->
                OutlinedButton(
                    onClick = { selectedVehicleId = vehicle.id },
                    modifier = Modifier.fillMaxWidth(),
                    border = if (selectedVehicleId == vehicle.id) BorderStroke(2.dp, BluePrimary) else null
                ) { Text(vehicle.name + (vehicle.plate?.let { " • $it" } ?: "")) }
                Spacer(Modifier.height(5.dp))
            }
            Spacer(Modifier.height(10.dp))
            Text("Categoria", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(6.dp))
            categories.forEach { item ->
                OutlinedButton(
                    onClick = { selectedCategoryId = item.id },
                    modifier = Modifier.fillMaxWidth(),
                    border = if (selectedCategoryId == item.id) BorderStroke(2.dp, BluePrimary) else null
                ) { Text(item.name) }
                Spacer(Modifier.height(5.dp))
            }
            OutlinedTextField(description, { description = it }, Modifier.fillMaxWidth(), label = { Text("Descrição*") }, singleLine = true)
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(amount, { amount = it }, Modifier.fillMaxWidth(), label = { Text("Valor (R$)*") }, singleLine = true)
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(merchant, { merchant = it }, Modifier.fillMaxWidth(), label = { Text("Estabelecimento") }, singleLine = true)
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(odometer, { odometer = it }, Modifier.fillMaxWidth(), label = { Text("KM no momento") }, singleLine = true)
            Spacer(Modifier.height(10.dp))
            Text("Pagamento", style = MaterialTheme.typography.labelLarge, color = TextSecondary)
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                listOf(ExpensePayment.PIX, ExpensePayment.CREDIT, ExpensePayment.DEBIT, ExpensePayment.CASH).forEach { method ->
                    FilterChipLike(method.name, payment == method, Modifier.weight(1f)) { payment = method }
                }
            }
            Spacer(Modifier.height(10.dp))
            OutlinedButton(onClick = { receiptPicker.launch("*/*") }, modifier = Modifier.fillMaxWidth()) {
                Icon(Icons.Filled.ReceiptLong, null)
                Spacer(Modifier.width(8.dp))
                Text(if (receiptName == null) "Adicionar comprovante" else "Comprovante: " + receiptName)
            }
            receiptName?.let {
                Text("O comprovante será enviado quando houver conexão.", color = TextSecondary, style = MaterialTheme.typography.bodySmall)
            }
            error?.let { Spacer(Modifier.height(8.dp)); Text(it, color = androidx.compose.ui.graphics.Color(0xFFF04438)) }
            Spacer(Modifier.height(12.dp))
            Button(onClick = {
                val cents = amount.replace(",", ".").toDoubleOrNull()?.let { kotlin.math.round(it * 100).toLong() }
                if (selectedVehicleId == null) error = "Selecione um veículo."
                else if (selectedCategoryId.isBlank()) error = "Selecione uma categoria."
                else if (cents == null) error = "Informe um valor válido."
                else {
                    expenseRepository.save(
                        vehicleId = selectedVehicleId!!,
                        categoryId = selectedCategoryId,
                        tripId = null,
                        expenseDate = LocalDate.now().toString(),
                        description = description,
                        amountCents = cents,
                        odometerM = odometer.toLongOrNull(),
                        merchant = merchant,
                        paymentMethod = payment,
                        notes = null
                    ).onSuccess { saved ->
                        val attachmentResult = receiptUri?.let { uriString ->
                            attachmentRepository.save(
                                Attachment(
                                    id = UUID.randomUUID().toString(),
                                    expenseId = saved.id,
                                    localUri = uriString,
                                    originalFilename = receiptName ?: "comprovante",
                                    mimeType = if (uriString.startsWith("file://")) {
                                        receiptName?.substringAfterLast('.', "").takeIf { !it.isNullOrBlank() }?.let {
                                            android.webkit.MimeTypeMap.getSingleton().getMimeTypeFromExtension(it)
                                        } ?: "application/octet-stream"
                                    } else {
                                        appContext.contentResolver.getType(android.net.Uri.parse(uriString))
                                            ?: "application/octet-stream"
                                    },
                                    fileSizeBytes = if (uriString.startsWith("file://")) {
                                        java.io.File(android.net.Uri.parse(uriString).path!!).length()
                                    } else {
                                        0L
                                    }
                                )
                            )
                        }
                        if (attachmentResult?.isFailure == true) {
                            error = attachmentResult.exceptionOrNull()?.message
                                ?: "A despesa foi salva, mas o comprovante não pôde ser associado."
                        } else {
                            description = ""; amount = ""; merchant = ""; odometer = ""; receiptUri = null; receiptName = null; error = null; version++
                            SyncScheduler.requestNow(appContext)
                        }
                    }.onFailure { error = it.message ?: "Não foi possível salvar a despesa." }
                }
            }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) { Text("Salvar despesa") }
        }
        Spacer(Modifier.height(20.dp))
        Text("Últimas despesas", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        expenses.take(20).forEach { expense ->
            Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(expense.description, fontWeight = FontWeight.Bold)
                        Text(expense.expenseDate + " • " + (categoryNames[expense.categoryId] ?: "Categoria"), color = TextSecondary)
                    }
                    Text("R$ %.2f".format(java.util.Locale("pt", "BR"), expense.amountCents / 100.0), color = BluePrimary, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun FilterChipLike(label: String, selected: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    OutlinedButton(
        onClick = onClick,
        border = if (selected) BorderStroke(2.dp, BluePrimary) else null,
        modifier = modifier
    ) { Text(label.take(6)) }
}

@Composable
private fun TripsScreen(
    vehicleRepository: VehicleLocalRepository,
    tripRepository: TripLocalRepository,
    onBack: () -> Unit,
    onNewTrip: () -> Unit
) {
    val trips = remember { tripRepository.list().sortedByDescending { it.tripDate } }
    val vehicles = remember { vehicleRepository.listActive().associateBy { it.id } }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Voltar") }
            Text("Minhas viagens", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(8.dp))
        Text("Histórico local das viagens registradas.", color = TextSecondary)
        Spacer(Modifier.height(16.dp))
        Button(onClick = onNewTrip, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) {
            Icon(Icons.Filled.Add, null)
            Spacer(Modifier.width(8.dp))
            Text("Nova viagem")
        }
        Spacer(Modifier.height(16.dp))
        if (trips.isEmpty()) {
            Card(colors = CardDefaults.cardColors(containerColor = BlueLight), shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp)) {
                    Text("Nenhuma viagem registrada.", fontWeight = FontWeight.Bold, color = BlueDark)
                    Text("Quando você salvar uma viagem, ela aparecerá aqui.", color = BlueDark)
                }
            }
        } else {
            trips.forEach { trip ->
                val vehicle = vehicles[trip.vehicleId]
                val km = trip.distanceM ?: 0L
                Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.Route, null, tint = BluePrimary)
                            Spacer(Modifier.width(10.dp))
                            Column(Modifier.weight(1f)) {
                                Text(trip.destination ?: "Viagem sem destino", fontWeight = FontWeight.Bold)
                                Text(trip.tripDate, color = TextSecondary)
                            }
                            Text("$km km", color = BluePrimary, fontWeight = FontWeight.Bold)
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(
                            listOfNotNull(
                                vehicle?.name,
                                vehicle?.plate,
                                trip.origin?.let { "Origem: $it" }
                            ).joinToString(" • "),
                            color = TextSecondary
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            when (trip.status) {
                                TripStatus.COMPLETED -> "Concluída"
                                TripStatus.DRAFT -> "Em aberto"
                                TripStatus.CANCELLED -> "Cancelada"
                            },
                            color = if (trip.status == TripStatus.COMPLETED) androidx.compose.ui.graphics.Color(0xFF12B76A) else TextSecondary,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun VehicleScreen(
    repository: VehicleLocalRepository,
    onBack: () -> Unit
) {
    var name by rememberSaveable { mutableStateOf("") }
    var brand by rememberSaveable { mutableStateOf("") }
    var model by rememberSaveable { mutableStateOf("") }
    var year by rememberSaveable { mutableStateOf("") }
    var plate by rememberSaveable { mutableStateOf("") }
    var initialKm by rememberSaveable { mutableStateOf("") }
    var error by rememberSaveable { mutableStateOf<String?>(null) }
    var version by rememberSaveable { mutableStateOf(0) }
    val vehicles = remember(version) { repository.listActive() }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Voltar") }
            Text("Meus veículos", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(16.dp))
        Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Text("Cadastrar veículo", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(12.dp))
                OutlinedTextField(name, { name = it }, Modifier.fillMaxWidth(), label = { Text("Nome*") }, singleLine = true)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(brand, { brand = it }, Modifier.fillMaxWidth(), label = { Text("Marca") }, singleLine = true)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(model, { model = it }, Modifier.fillMaxWidth(), label = { Text("Modelo") }, singleLine = true)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(year, { year = it }, Modifier.fillMaxWidth(), label = { Text("Ano") }, singleLine = true)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(plate, { plate = it }, Modifier.fillMaxWidth(), label = { Text("Placa") }, singleLine = true)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(initialKm, { initialKm = it }, Modifier.fillMaxWidth(), label = { Text("KM atual/inicial") }, singleLine = true)
                error?.let {
                    Spacer(Modifier.height(8.dp))
                    Text(it, color = androidx.compose.ui.graphics.Color(0xFFF04438))
                }
                Spacer(Modifier.height(12.dp))
                Button(onClick = {
                    val result = repository.save(name, brand, model, year.toIntOrNull(), plate, "flex", initialKm.toLongOrNull() ?: 0L, vehicles.isEmpty())
                    result.onSuccess {
                        name = ""; brand = ""; model = ""; year = ""; plate = ""; initialKm = ""; error = null; version++
                    }.onFailure { error = it.message ?: "Não foi possível cadastrar o veículo." }
                }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) { Text("Salvar veículo") }
            }
        }
        Spacer(Modifier.height(18.dp))
        Text("Veículos cadastrados", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(8.dp))
        if (vehicles.isEmpty()) Text("Nenhum veículo cadastrado.", color = TextSecondary)
        else vehicles.forEach { vehicle ->
            Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                Column(Modifier.padding(16.dp)) {
                    Text(vehicle.name, fontWeight = FontWeight.Bold)
                    Text(listOfNotNull(vehicle.brand, vehicle.model, vehicle.plate).joinToString(" • ").ifBlank { "Sem detalhes adicionais" }, color = TextSecondary)
                    Text("KM atual: " + vehicle.currentOdometerM, color = TextSecondary)
                    if (vehicle.isDefault) Text("Veículo padrão", color = BluePrimary, fontWeight = FontWeight.Bold)
                    else TextButton(onClick = { repository.setDefault(vehicle.id); version++ }) { Text("Tornar padrão") }
                }
            }
        }
    }
}

@Composable
private fun CalendarScreen(onBack: () -> Unit) {
    var connected by rememberSaveable { mutableStateOf(false) }
    var selectedCalendar by rememberSaveable { mutableStateOf("Agenda principal") }
    var lastSync by rememberSaveable { mutableStateOf("Nunca sincronizado") }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, "Voltar") }
            Column {
                Text("Agenda", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Text("Agenda interna + Google Agenda", color = TextSecondary)
            }
        }
        Spacer(Modifier.height(18.dp))
        Card(colors = CardDefaults.cardColors(containerColor = CardWhite), shape = RoundedCornerShape(20.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Text(if (connected) "Google Agenda conectado" else "Google Agenda não conectado", fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(6.dp))
                Text(
                    if (connected) "Conta conectada e pronta para sincronização."
                    else "Conecte sua conta para escolher uma agenda e importar compromissos.",
                    color = TextSecondary
                )
                Spacer(Modifier.height(16.dp))
                if (!connected) {
                    Button(onClick = { connected = true }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(14.dp)) {
                        Text("Conectar Google Agenda")
                    }
                } else {
                    Text("Calendário selecionado", style = MaterialTheme.typography.labelLarge, color = TextSecondary)
                    Spacer(Modifier.height(6.dp))
                    OutlinedButton(
                        onClick = { selectedCalendar = if (selectedCalendar == "Agenda principal") "Agenda pessoal" else "Agenda principal" },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Filled.CalendarMonth, null)
                        Spacer(Modifier.width(8.dp))
                        Text(selectedCalendar)
                    }
                    Spacer(Modifier.height(12.dp))
                    Button(
                        onClick = { lastSync = "Sincronizado agora" },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp)
                    ) { Text("Sincronizar agora") }
                    Spacer(Modifier.height(10.dp))
                    Text("Última sincronização: $lastSync", color = TextSecondary)
                    Spacer(Modifier.height(8.dp))
                    TextButton(onClick = { connected = false }) { Text("Desconectar Google Agenda") }
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        Card(colors = CardDefaults.cardColors(containerColor = BlueLight), shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Text("Proteção contra duplicados", fontWeight = FontWeight.Bold, color = BlueDark)
                Spacer(Modifier.height(5.dp))
                Text("Cada evento Google é identificado por conexão + ID do evento. Repetir a sincronização atualiza o evento existente em vez de criar outro.", color = BlueDark)
            }
        }
    }
}
