import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
    
    var webView: WKWebView!
    
    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.mediaTypesRequiringUserActionForPlayback = []
        
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 상태바 스타일 설정
        setNeedsStatusBarAppearanceUpdate()
        
        // 로컬 서버 또는 번들된 HTML 로드
        if let url = URL(string: "http://localhost:3000") {
            let request = URLRequest(url: url)
            webView.load(request)
        } else {
            loadLocalHTML()
        }
    }
    
    func loadLocalHTML() {
        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "www") {
            let htmlUrl = URL(fileURLWithPath: htmlPath)
            webView.loadFileURL(htmlUrl, allowingReadAccessTo: htmlUrl.deletingLastPathComponent())
        }
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    override var prefersHomeIndicatorAutoHidden: Bool {
        return true
    }
    
    // WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // 네비게이션 완료 시 처리
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("웹뷰 로드 실패: \(error.localizedDescription)")
        loadLocalHTML()
    }
}