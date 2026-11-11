/**
 * 화면 전체에 깔리는 필름 그레인 (기획서 4-3, R3 Ironclad Labs 참고)
 * 장식이므로 화면낭독기와 마우스 입력 모두에서 제외한다.
 */
export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />;
}
