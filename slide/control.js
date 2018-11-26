getCamLookAt = function() {
    var m = new THREE.Matrix4().set(  
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, scale(-1),
        0, 0, 0, 1 );

    var matrixLookAt = camera.matrix.clone();
    matrixLookAt.multiply(m);
    return new THREE.Vector3().setFromMatrixPosition( matrixLookAt );
}


function transform( targets, duration ) {
    duration = duration || 2000;
    targets = targets || currntObject3d;
    currntObject3d = targets;

    TWEEN.removeAll();

    for ( var i = 0; i < objects.length; i ++ ) {

        var object = objects[ i ];
        var target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render )
        .start();

}




function moveCameraTo (object, execShown, time, separation) {
     try {
    var m = object.matrix.clone();
    var m2 = object.matrix.clone();
    time = time || 600;
    separation = separation || 3;

        m.set(  1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, scale(separation),
                0, 0, 0, 1 );
    m2.set(  1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, scale(-1),
        0, 0, 0, 1 );
    var matrix = object.matrix.clone();
    var matrix2 = object.matrix.clone();
    var matrixLookAt = camera.matrix.clone();
    matrix.multiply(m);
    matrix2.multiply(m2);
    var vector = new THREE.Vector3().setFromMatrixPosition( matrix );
    console.log('object', object.position);
    rotateActive = false;

    if (isNaN(camera.position.x)) {
        camera.position.set(0,0,0);
    }

    var pos =  camera.position.clone();
     new TWEEN.Tween(pos)
            .to(vector.clone(), time)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
            camera.position.set(this.x, this.y, this.z);
            render()
        })
            .onComplete(function () {
                
        })
        .start(); 
        
        var v2 = new THREE.Vector3().setFromMatrixPosition( matrix2 );

        new TWEEN.Tween( getCamLookAt())
            .to(v2, (time + 100))
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
             camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
             render();
        })
            .onComplete(function () {
                if(execShown && object.item.onShown) {
                    object.item.onShown();
                }
    
        })
        .start();
    } catch (ex) {
        console.log('error: ' + ex.message);
    }
    
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    TWEEN.update();
}

function next(time, separation) {
    currentSlide = currentSlide >= table.length - 1 ? 0 : currentSlide + 1;
    var item = table[currentSlide].itemView;
    moveCameraTo(item, true, time, separation);
}

function prev() {        
    currentSlide = currentSlide <= 0 ? table.length - 1 : currentSlide - 1;
    moveCameraTo(table[currentSlide].itemView);

}

function demo(isOn) {
    if(!isOn) {
        clearInterval(interval);
        document.getElementById("videoDemo").pause();
        return;
    }
    document.getElementById("videoDemo").play(); 
    interval = setInterval(function(){
        next();
    }, 1800)
}

function rotateCamera(dX, dY, dZ){
    var v = THREE.Vector3(dX, dY, dZ);

    camera.matrix.makeRotationY();

    new TWEEN.Tween( getCamLookAt())
            .to(v2, (time + 100))
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
             camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
             render();
        })
            .onComplete(function () {
              
    
        })
}

function onRandom (isRan) {
    var key = 'index';
    if(isRan) {
        key = 'ran';
    }

    objects.sort(function(a, b) {
        return a[key] - b[key];
      });
      transform(); 
    
}

var step = 0;

function render() {
    lookAtCenter && camera.lookAt(new THREE.Vector3(0,0,0));
    renderer.render(scene, camera);
}

