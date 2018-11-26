
var camera, scene, renderer;
var controls;
var currentSlide = -1;

var currntObject3d = [];

renderer = new THREE.CSS3DRenderer();

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };



function scale(value) {
    return value * 100 * nScale;
}

function init() {

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 50000 );
    camera.position.z =  scale(42);
    camera.position.y =  scale(11);

    scene = new THREE.Scene();
    

    // table

    for ( var i = 0; i < table.length; i ++ ) {
        var item = table[i];
        item.index = i;
        
        var element = document.createElement( 'div' );
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

        var content = document.createElement( 'div' );
        if (item.slide) {
            content.className = 'body';
            content.appendChild(document.getElementById(item.slide));
        } else {
            content.className = 'symbol';
            content.textContent = item.text;
        }
        element.appendChild( content );

        

        var object = new THREE.CSS3DObject( element );
        object.position.x = Math.random() * scale(40) - scale(20);
        object.position.y = Math.random() * scale(40) - scale(20);
        object.position.z = Math.random() * scale(40) - scale(20);
        object.ran = Math.random();
        object.index = item.index;
        scene.add( object );

        objects.push( object );

        //
        item.itemView = object;
        object.item = item;
        element.item = item;

        element.addEventListener( 'click', function () {
            currentSlide = this.item.index;
            moveCameraTo(this.item.itemView);
        }, false );

        //

        var object = new THREE.Object3D();
        var n = 10;
        object.position.x = ( (i % n )  * scale(1.4)) - scale(1.4*n / 2);
        object.position.y = - ( parseInt(i / n) * scale(1.8)  ) + scale(1.8*n/ 2) ;
        object.position.z = scale(10);
        targets.table.push( object );

    }

    // sphere

    var vector = new THREE.Vector3();
    
    for ( var i = 0, l = objects.length; i < l; i ++ ) {

        var phi = Math.acos( - 1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;

        var object = new THREE.Object3D();

        object.position.setFromSphericalCoords( scale(8), phi, theta );

        vector.copy( object.position ).multiplyScalar( 2 );

        object.lookAt( vector );

        targets.sphere.push( object );

    }

    // helix

    var vector = new THREE.Vector3();

    for ( var i = 0, l = objects.length; i < l; i ++ ) {

        var theta = i * 0.2 + 1.80*Math.PI;
        var y = - ( i * scale(0.08) ) + scale(4,5);

        var object = new THREE.Object3D();

        object.position.setFromCylindricalCoords( scale(17), theta, y );

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt( vector );

        targets.helix.push( object );

    }

    // grid

    for ( var i = 0; i < objects.length; i ++ ) {

        var object = new THREE.Object3D();

        object.position.x = ( ( i % 5 ) * scale(4) ) - scale(8);
        object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * scale(4) ) + scale(8);
        object.position.z = ( Math.floor( i / 25 ) ) * scale(10) + scale(10);

        targets.grid.push( object );

    }

    //

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById( 'container' ).appendChild( renderer.domElement );

    //

    // controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls = new THREE.OrbitControls(camera);
    controls.rotateSpeed = 0.5;
    controls.minDistance = scale(0);
    controls.addEventListener( 'change', render );

    var chkRan = document.getElementById( 'random' );
    var onRandom = function () {
        var key = 'index';
        if(chkRan.checked) {
            key = 'ran';
        }

        objects.sort(function(a, b) {
            return a[key] - b[key];
          });
        
    }
    chkRan.addEventListener( 'change', onRandom, false );

    var button = document.getElementById( 'table' );
    button.addEventListener( 'click', function () {

        transform( targets.table, 2000 );

    }, false );

    var button = document.getElementById( 'sphere' );
    button.addEventListener( 'click', function () {
        chkRan.checked = true;
        onRandom();
        transform( targets.sphere, 2000 );

    }, false );

    var button = document.getElementById( 'helix' );
    button.addEventListener( 'click', function () {
        
        transform( targets.helix, 2000 );

    }, false );

    var button = document.getElementById( 'grid' );
    button.addEventListener( 'click', function () {
        
        transform( targets.grid, 2000 );

    }, false );

    var button = document.getElementById( 'prev' );
    button.addEventListener( 'click', function(ev){
        prev(ev);
    }, false );

    var buttonNext = document.getElementById( 'next' );
    buttonNext.addEventListener( 'click', function(ev){
        next.apply(window);
    }, false );

    var button = document.getElementById( 'reset' );
    button.addEventListener( 'click', function () {
        currentSlide = 0;
        controls.reset();

    }, false );

    var button = document.getElementById( 'demo' );
    var interval = 0;
    button.addEventListener( 'change', function(ev){
        demo(ev);
    }, false );

    
    render();
   
    window.addEventListener( 'resize', onWindowResize, false );

}

$('.btn-start').on('click', function(){
    $(this).hide();
    $('#container, #menu').show();
    init();
    animate();
    setTimeout(function(){
        transform( targets.helix, 2000 );
        setTimeout(function(){
            next();
        }, 4000);
    }, 1000);

    
})

