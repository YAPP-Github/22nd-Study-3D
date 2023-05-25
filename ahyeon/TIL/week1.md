# 1주차 스터디 내용

> 본 강의에서는 객체 지향 프로그래밍으로 three.js를 학습한다. 따라서, 클래스 정의와 생성자 정의, 메소드 정의들을 차례차례 배울 수 있다.

## #02. 기본 세팅과 메시 생성

![01_basic.js](Week1%20c122e75be3084dee8d6bb6c7b88634af/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-05-25_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_9.08.37.png)

`this._divContainer`

- 위처럼 ‘\_’가 붙은 변수는, 클래스 내부에서만 사용하는 프라이빗 field, method에 해당한다. js파일이라면 private 선언이 불가능하지만 타입스크립트에선 프라이빗 키워드가 지원된다(?)

`window.onresize`

- 생성자에서 window.onresize 메소드에 `this.resize.bind(this)` 를 쓰고 있는데 이 코드를 통해 윈도에 객체를 바인딩한다. 디바이스 사이즈 리사이즈 때마다 객체 리사이즈 메소드도 적용해줄 수 있다함.

`this._scene`

- 객체에 삼차원 scene을 만든다고 생각하자.

`this._setupCamera();`

- three.js가 가질 3차원 객체의 카메라를 정의
- `this._camera = camera` 필드 선언을 통해 App class 내에서 camera객체를 참조할 수 있게 한다.

`this._setupLight();`

- 라이트 객체를 추가

`this.resize();`

- 렌더러와 카메라 크기를 윈도우 사이즈에 맞춰줌
- id가 webgl_container인 this.\_divContainer의 사이즈를 참조해 카메라와 렌더러의 사이즈를 설정한다.

`request AnimationFrame(this.render.bind(this))`

- this.render.bind의 this 키워드는 바인드를 통해 class App 객체를 가리킨다.
- 메소드에 넘겨서 적당 시점에 렌더 메소드를 호출해 줌
- 렌더 메소드를 반복문으로 호출해서 프레임을 1초마다 새로 렌더링함

`render(time){}`

- 렌더링이 시작한 후 흐른 시간 인자인 time.
- animation에 사용하기 위해 받아옴

`render(this.scene, this.camera)`

- 카메라의 시점을 이용해 렌더러가 scene을 렌더하는 메소드

`update(time)`

- 메소드 내에서 설정을 변경하여 렌더 시점에 새로운 효과를 적용함
- tiem \*= 0.001 : time을 mm단위에서 ms 단위로 변경함
- 1초마다 작동하는 애니메이션을 컨트롤하고 프레임 반영

`this._cube.rotation.x`

- App에 생성된 메쉬 객체의 x, y, z축 회전 값에 time을 넣어 조정.
- time이 변할때마다 requestAnimationFrame(this.render.bind(this));에 의해 새로운 프레임이 렌더링되고 회전하는 객체가 웹 상에 렌더링된다.

## #03. Geometry 1

3강에서는, Scene 내의 Geometry를 관장하는 setupModel method를 수정했다.

```tsx
_setupModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x515151 });
    const cube = new THREE.Mesh(geometry, material);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const line = new THREE.LineSegments(new THREE.WireframeGeometry, lineMaterial);

    const group = new THREE.Group()
    group.add(cube);
    group.add(line);

    this._scene.add(group);
  }
```

`lineMatreial` 을 추가해보자. 3차원 공간에 선분 메테리얼을 추가한다. 인자로 해당 선분의 컬러를 받고있다.

LineSegments는 [WireframeGeometry](https://threejs.org/docs/#api/en/geometries/WireframeGeometry)를 이용해서 Box에 line material을 덧씌운다. 공식 문서에 따르면, LineSegments에 depthTest, opacity, transparent와 같은 property가 있으므로 opacity를 0으로 둬서 메쉬를 unvisible하게 만들고 지오메트리를 따르는 애니메이션을 추가할 수 있을 거 같다.

![스크린샷 2023-05-25 오후 9.07.54.png](Week1%20c122e75be3084dee8d6bb6c7b88634af/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-05-25_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_9.07.54.png)

`BoxGeometry(1, 1, 1)`

인자를 가로, 세로, 깊이 순으로 본다. 깊이는 기본 값을 1로 받는데, 깊이가 올라갈 수록 메쉬를 분할하는 개수가 늘어난다.

메쉬가 늘어날 수록, 같은 메쉬라도 더 정밀하게 표현할 수 있고 더욱 부드러운 텍스쳐를 표현할 수 있다. 단, depth가 너무 과도하게 증가하면 연산에 부담이 되므로 성능 저하의 요인이 될 수 있다.
