// Disable DebuggingOverlay in development
if (__DEV__) {
  const emptyComponent = () => null;
  
  // Mock the DebuggingOverlayNativeComponent
  jest.mock('react-native/src/private/specs/components/DebuggingOverlayNativeComponent', () => ({
    __esModule: true,
    default: emptyComponent,
    Commands: {
      highlightTraceUpdates: () => {},
      highlightElements: () => {},
      clearElementsHighlights: () => {},
    },
  }));
}