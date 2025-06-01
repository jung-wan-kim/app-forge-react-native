#!/bin/bash

# React Native iOS 프로젝트 생성 스크립트
set -e

echo "🍎 React Native iOS 프로젝트 생성 시작..."

# 프로젝트 루트 디렉토리 확인
PROJECT_ROOT="/Users/jung-wankim/Project/app-forge"
cd "$PROJECT_ROOT"

# 프로젝트 이름
PROJECT_NAME="TikTokClone"

# iOS 디렉토리가 이미 있는지 확인
if [ -d "ios" ] && [ -f "ios/Podfile" ]; then
    echo "⚠️  기존 iOS 디렉토리 백업 중..."
    mv ios ios_backup_$(date +%Y%m%d_%H%M%S)
fi

echo "📁 iOS 프로젝트 구조 생성 중..."

# iOS 디렉토리 구조 생성
mkdir -p ios/$PROJECT_NAME
mkdir -p ios/$PROJECT_NAME.xcodeproj
mkdir -p ios/$PROJECT_NAME/Images.xcassets/AppIcon.appiconset
mkdir -p ios/$PROJECT_NAME/Images.xcassets/Contents.json

# AppDelegate.h 생성
cat > ios/$PROJECT_NAME/AppDelegate.h << 'EOF'
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : RCTAppDelegate

@end
EOF

# AppDelegate.mm 생성
cat > ios/$PROJECT_NAME/AppDelegate.mm << 'EOF'
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"TikTokClone";
  self.initialProps = @{};
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
EOF

# main.m 생성
cat > ios/$PROJECT_NAME/main.m << 'EOF'
#import <UIKit/UIKit.h>

#import "AppDelegate.h"

int main(int argc, char *argv[])
{
  @autoreleasepool {
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
EOF

# Info.plist 생성
cat > ios/$PROJECT_NAME/Info.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleDisplayName</key>
	<string>TikTok Clone</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>CFBundleSignature</key>
	<string>????</string>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>NSAppTransportSecurity</key>
	<dict>
		<key>NSAllowsArbitraryLoads</key>
		<true/>
		<key>NSExceptionDomains</key>
		<dict>
			<key>localhost</key>
			<dict>
				<key>NSExceptionAllowsInsecureHTTPLoads</key>
				<true/>
			</dict>
		</dict>
	</dict>
	<key>NSCameraUsageDescription</key>
	<string>This app needs access to camera to upload videos.</string>
	<key>NSMicrophoneUsageDescription</key>
	<string>This app needs access to microphone to record videos.</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>This app needs access to photo library to select videos.</string>
	<key>UILaunchStoryboardName</key>
	<string>LaunchScreen</string>
	<key>UIRequiredDeviceCapabilities</key>
	<array>
		<string>armv7</string>
	</array>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
		<string>UIInterfaceOrientationLandscapeLeft</string>
		<string>UIInterfaceOrientationLandscapeRight</string>
	</array>
	<key>UIViewControllerBasedStatusBarAppearance</key>
	<false/>
</dict>
</plist>
EOF

# LaunchScreen.storyboard 생성
cat > ios/$PROJECT_NAME/LaunchScreen.storyboard << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="15702" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
    <device id="retina4_7" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="15704"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <view key="view" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="frame" x="0.0" y="0.0" width="375" height="667"/>
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <label opaque="NO" clipsSubviews="YES" userInteractionEnabled="NO" contentMode="left" horizontalHuggingPriority="251" verticalHuggingPriority="251" text="TikTok Clone" textAlignment="center" lineBreakMode="middleTruncation" baselineAdjustment="alignBaselines" minimumFontSize="18" translatesAutoresizingMaskIntoConstraints="NO" id="GJd-Yh-RWb">
                                <rect key="frame" x="0.0" y="202" width="375" height="43"/>
                                <fontDescription key="fontDescription" type="boldSystem" pointSize="36"/>
                                <nil key="highlightedColor"/>
                            </label>
                        </subviews>
                        <color key="backgroundColor" systemColor="systemBackgroundColor" cocoaTouchSystemColor="whiteColor"/>
                        <constraints>
                            <constraint firstItem="Bcu-3y-fUS" firstAttribute="centerX" secondItem="GJd-Yh-RWb" secondAttribute="centerX" id="Q3B-4B-g5h"/>
                            <constraint firstItem="GJd-Yh-RWb" firstAttribute="centerY" secondItem="Ze5-6b-2t3" secondAttribute="bottom" multiplier="1/3" constant="1" id="moa-c2-u7t"/>
                            <constraint firstItem="GJd-Yh-RWb" firstAttribute="leading" secondItem="Bcu-3y-fUS" secondAttribute="leading" symbolic="YES" id="x7j-FC-K8j"/>
                        </constraints>
                        <viewLayoutGuide key="safeArea" id="Bcu-3y-fUS"/>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="52.173913043478265" y="375"/>
        </scene>
    </scenes>
</document>
EOF

# Images.xcassets/Contents.json 생성
cat > ios/$PROJECT_NAME/Images.xcassets/Contents.json << 'EOF'
{
  "info": {
    "version": 1,
    "author": "xcode"
  }
}
EOF

# Images.xcassets/AppIcon.appiconset/Contents.json 생성
cat > ios/$PROJECT_NAME/Images.xcassets/AppIcon.appiconset/Contents.json << 'EOF'
{
  "images": [
    {
      "idiom": "iphone",
      "scale": "2x",
      "size": "20x20"
    },
    {
      "idiom": "iphone",
      "scale": "3x",
      "size": "20x20"
    },
    {
      "idiom": "iphone",
      "scale": "2x",
      "size": "29x29"
    },
    {
      "idiom": "iphone",
      "scale": "3x",
      "size": "29x29"
    },
    {
      "idiom": "iphone",
      "scale": "2x",
      "size": "40x40"
    },
    {
      "idiom": "iphone",
      "scale": "3x",
      "size": "40x40"
    },
    {
      "idiom": "iphone",
      "scale": "2x",
      "size": "60x60"
    },
    {
      "idiom": "iphone",
      "scale": "3x",
      "size": "60x60"
    },
    {
      "idiom": "ios-marketing",
      "scale": "1x",
      "size": "1024x1024"
    }
  ],
  "info": {
    "author": "xcode",
    "version": 1
  }
}
EOF

# 기존 Podfile 백업에서 복사
if [ -f "ios_backup_*/Podfile" ]; then
    cp ios_backup_*/Podfile ios/
else
    # 새 Podfile 생성
    cat > ios/Podfile << 'EOF'
# Resolve react_native_pods.rb with node to allow for hoisting
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

platform :ios, min_ios_version_supported
prepare_react_native_project!

flipper_config = ENV['NO_FLIPPER'] == "1" ? FlipperConfiguration.disabled : FlipperConfiguration.enabled

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'TikTokClone' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target 'TikTokCloneTests' do
    inherit! :complete
  end

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
  end
end
EOF
fi

echo "✅ iOS 프로젝트 기본 구조 생성 완료!"
echo ""
echo "다음 단계:"
echo "1. CocoaPods 설치: brew install cocoapods"
echo "2. Pod 설치: cd ios && pod install"
echo "3. Xcode 프로젝트 생성: 수동으로 Xcode에서 생성 필요"
echo ""
echo "또는 다음 명령으로 전체 프로젝트 재생성:"
echo "npx react-native init TikTokClone --directory temp_project"
echo "cp -r temp_project/ios ."
echo "rm -rf temp_project"