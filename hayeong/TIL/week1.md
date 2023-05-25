# 1강 개발 환경 구성 & 2강 기본 구성 요소와 코드 
## three.js 라이브러리의 빌드 파일
- three.js: 라이브러리 코드
- three.min.js: 라이브러리 용량을 줄여놓은 압축 파일
- three.module.js: 모듈 방식으로 사용할 수 있는 라이브러리

module로 구현할 것이므로 three.module.js을 사용한다.
```html
<script type="module" src="../src/01-basic.js" defer></script>
```
- module 타입으로 js 파일을 임포트한다.
- defer 키워드: 페이지가 모두 로딩 된 후 자바스크립트 실행한다.

## three.js의 기본 구성 요소
![구성요소](/hayeong/TIL/assets/01-구성요소.png)

### Renderer
Scene을 화면에 출력해주는 렌더러

### Scene
3차원 객체로 구성되는 장면. Light와 Mesh로 구성됨

#### Light
3차원 형상이 화면 상에 표시되기 위한 광원
#### Mesh
Object3D의 파생 클래스. Geometry와 Material로 구성
- Geometry: 형상을 정의
- Material: 색상 및 투명도 등을 정의

### Camera
Scene을 바라보는 시점.

3차원의 Scene은 어느 시점에서 바라보느냐에 따라 다르게 보임. Camera로 이 시점을 정의할 수 있다.


## PRACTICE: 회전하는 파란색 정육면체 렌더링하기
id가 `webgl-container`인 div element 안에 3차원 객체를 렌더링한다.

### 1. WebGL 렌더러 생성 `THREE.WebGLRenderer`
- antialias 옵션을 true로 주면 3차원 장면이 렌더링될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현된다.
- `setPixelRatio` 메소드로 픽셀 비율을 `window.devicePixelRatio`로 설정한다. 사용자의 기기에 맞는 픽셀 비율을 사용할 수 있다.
- `renderer.domElement`: canvas 타입의 DOM 객체로, `webgl-container`의 자식으로 추가한다. 여기서 내가 만든 Scene이 렌더링 될 것이다.

### 2. Scene 객체 생성 `THREE.Scene()`

### 3. Camera 셋업 `THREE.PerspectiveCamera`
- Camera 객체 생성 시 fov, aspect, near, far를 지정할 수 있다. (다음 강의에서 자세히 설명)
- aspect를 `webgl-container`(렌더러 DOM 엘리먼트의 부모 엘리먼트)의 aspect와 같게 설정한다.
- Camera 객체의 position 필드로 위치를 지정할 수 있다.

### 4. Light 셋업 `THREE.DirectionalLight`
- 광원 생성 시 광원의 색상, 세기, 위치 값을 지정한다.
- 생성된 Light 객체를 Scene에 추가한다.

### 5. Mesh(Model) 셋업 `THREE.Mesh`
- Mesh는 Geometry(`THREE.BoxGeometry`) 객체와 Material(`THREE.MeshPhongMaterial`) 객체로 구성된다.
- BoxGeometry: 정육면체 형상을 정의한다. 가로, 세로, 깊이를 지정할 수 있다.
- MeshPhongMaterial: 정육면체의 색상을 정의한다.
- 생성된 Mesh 객체(`cube`)는 Scene에 추가한다.

### 6. resize 이벤트 핸들러
-  resize 이벤트가 필요한 이유: Renderer나 Camera는 창 크기가 변경될 때 마다 그 크기에 맞게 속성 값을 재설정해줘야 함.
- resize 이벤트가 발생하면 
  - Camera의 aspect를 `webgl-container`의 aspect로 다시 지정한다. aspect 지정 후 Camera의 `updateProjectionMatrix` 메소드를 호출해야 한다.
  - Renderer의 사이즈를 `webgl-container` 크기로 변경한다. Renderer의 `setSize` 메소드 사용
- resize 메소드에 this binding 필요 (this가 가르키는 객체가 이벤트 객체가 아니라 이 App 클래스의 객체가 되어야 하므로)

### 7. Renderer로 3차원 그래픽 Scene을 렌더링
- Renderer의 render 메소드로 화면에 그려준다.
  - 화면에 그릴 Scene과 Camera를 지정한다.
- `time` 파라미터로 렌더링이 처음 시작된 이후 경과된 시간값을 ms로 받는다.
- 이 `time`을 이용해 애니메이션 효과를 구현한다.
  - 큐브의 `rotation` 필드값을 `time`에 따라 변화시키면서 큐브를 회전시킨다.
- `requestAnimationFrame` 메소드를 통해 `render` 함수를 호출한다. -> 적당한 시점에, 또는 최대한 빠르게 `render`가 호출됨.


