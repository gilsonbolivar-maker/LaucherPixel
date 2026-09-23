package com.pixelnexo.launcher

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Base64
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.ServiceWorkerClient
import android.webkit.ServiceWorkerController
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream

/**
 * Pixel Nexo Dev Launcher
 * Tela inicial Android que exibe a interface web (React) empacotada em assets/www
 * e expõe uma ponte JS (window.PixelNexoAndroid) para listar e abrir os apps reais.
 */
class MainActivity : Activity() {

    private lateinit var webView: WebView
    private var pendingPermissionRequest: PermissionRequest? = null
    private var cachedAppsJson: String? = null

    private val assetLoader by lazy {
        WebViewAssetLoader.Builder()
            .addPathHandler("/", WwwPathHandler(this))
            .build()
    }

    private val packageReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            cachedAppsJson = null
            dispatchJsEvent("pixelnexo:apps-changed")
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        hideStatusBar()

        webView = WebView(this).apply {
            setBackgroundColor(0xFF160324.toInt())
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            settings.allowFileAccess = false
            addJavascriptInterface(Bridge(), "PixelNexoAndroid")
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? = assetLoader.shouldInterceptRequest(request.url)

                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    request: WebResourceRequest
                ): Boolean {
                    if (request.url.host == ASSET_HOST) return false
                    // Links externos abrem no navegador do celular
                    runCatching { startActivity(Intent(Intent.ACTION_VIEW, request.url)) }
                    return true
                }
            }
            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) {
                    runOnUiThread { handleWebPermission(request) }
                }
            }
        }

        ServiceWorkerController.getInstance().setServiceWorkerClient(object : ServiceWorkerClient() {
            override fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse? =
                assetLoader.shouldInterceptRequest(request.url)
        })

        setContentView(webView)
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            webView.loadUrl("https://$ASSET_HOST/index.html")
        }

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_PACKAGE_ADDED)
            addAction(Intent.ACTION_PACKAGE_REMOVED)
            addAction(Intent.ACTION_PACKAGE_CHANGED)
            addDataScheme("package")
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(packageReceiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(packageReceiver, filter)
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onDestroy() {
        unregisterReceiver(packageReceiver)
        webView.destroy()
        super.onDestroy()
    }

    override fun onResume() {
        super.onResume()
        hideStatusBar()
    }

    // Botão Home pressionado com o launcher já aberto
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        dispatchJsEvent("pixelnexo:home")
    }

    // O botão voltar nunca fecha o launcher: é repassado para a interface web
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        dispatchJsEvent("pixelnexo:back")
    }

    private fun dispatchJsEvent(name: String) {
        if (::webView.isInitialized) {
            webView.evaluateJavascript("window.dispatchEvent(new Event('$name'))", null)
        }
    }

    // A interface web já desenha a própria barra de status
    @Suppress("DEPRECATION")
    private fun hideStatusBar() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.let {
                it.hide(WindowInsets.Type.statusBars())
                it.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            window.decorView.systemUiVisibility =
                View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        }
    }

    private fun handleWebPermission(request: PermissionRequest) {
        val wantsCamera = request.resources.contains(PermissionRequest.RESOURCE_VIDEO_CAPTURE)
        if (!wantsCamera || checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            request.grant(request.resources)
            return
        }
        pendingPermissionRequest = request
        requestPermissions(arrayOf(Manifest.permission.CAMERA), REQUEST_CAMERA)
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode != REQUEST_CAMERA) return
        val request = pendingPermissionRequest ?: return
        pendingPermissionRequest = null
        if (grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) {
            request.grant(request.resources)
        } else {
            request.deny()
        }
    }

    private fun buildAppsJson(): String {
        val pm = packageManager
        val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
        val apps = pm.queryIntentActivities(intent, 0)
            .filter { it.activityInfo.packageName != packageName }
            .distinctBy { it.activityInfo.packageName }
            .sortedBy { it.loadLabel(pm).toString().lowercase() }
        val array = JSONArray()
        for (info in apps) {
            array.put(JSONObject().apply {
                put("label", info.loadLabel(pm).toString())
                put("packageName", info.activityInfo.packageName)
                put("icon", drawableToDataUrl(info.loadIcon(pm)))
            })
        }
        return array.toString()
    }

    private fun drawableToDataUrl(drawable: Drawable): String {
        val size = 96
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, size, size)
        drawable.draw(canvas)
        val out = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
        bitmap.recycle()
        return "data:image/png;base64," + Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP)
    }

    inner class Bridge {
        @JavascriptInterface
        fun getInstalledApps(): String =
            cachedAppsJson ?: buildAppsJson().also { cachedAppsJson = it }

        @JavascriptInterface
        fun launchApp(pkg: String) {
            val intent = packageManager.getLaunchIntentForPackage(pkg) ?: return
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            runOnUiThread { runCatching { startActivity(intent) } }
        }

        @JavascriptInterface
        fun openAppInfo(pkg: String) {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:$pkg"))
            runOnUiThread { runCatching { startActivity(intent) } }
        }

        @JavascriptInterface
        fun openHomeSettings() {
            runOnUiThread { runCatching { startActivity(Intent(Settings.ACTION_HOME_SETTINGS)) } }
        }
    }

    /** Serve os arquivos de assets/www na raiz do domínio (o build do Vite usa caminhos "/"). */
    private class WwwPathHandler(context: Context) : WebViewAssetLoader.PathHandler {
        private val assetsHandler = WebViewAssetLoader.AssetsPathHandler(context)

        override fun handle(path: String): WebResourceResponse? {
            val file = if (path.isEmpty() || path.endsWith("/")) "${path}index.html" else path
            return assetsHandler.handle("www/$file")
        }
    }

    companion object {
        private const val ASSET_HOST = WebViewAssetLoader.DEFAULT_DOMAIN
        private const val REQUEST_CAMERA = 1001
    }
}
