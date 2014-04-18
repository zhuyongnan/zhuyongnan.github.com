/**
 * Created by Yongnanzhu on 4/17/2014.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

GeometryLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    //----------------------------------
    this.minColor = null;
    this.maxColor = null;

    //-----------------------------------
};
GeometryLoader.prototype = {

    constructor: GeometryLoader,

    load: function ( url, onLoad, onProgress, onError ) {

        var scope = this;

        var loader = new THREE.XHRLoader();
        loader.setCrossOrigin( this.crossOrigin );
        loader.load( url, function ( text ) {

            onLoad( scope.parse( text  ) );

        } );

    },

    parse: function ( text ) {
        var lines = text.split("\n");
        var totalFiberNum = lines[0];
        var startNum=1;

        var object = new THREE.Object3D();
        var material;
        var mesh;
        //-------------------------------
        var colorminx=1,colorminy=1,colorminz=1;
        var colormaxx=0,colormaxy=0,colormaxz=0;

        //------------------------------
        for(var i=0;i<totalFiberNum;i++)
        {
            var geometry;
            var totalVertexNum = lines[startNum];
            var vertexPosition = [];
            var vertexColor = [];
            for(var j = 1;j<=totalVertexNum;j++)
            {
                var vals = lines[startNum+j].split(/\s+/);
                vertexPosition.push( new THREE.Vector3( parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]) ) );
                vertexColor.push( new THREE.Vector3( parseFloat(vals[3]), parseFloat(vals[4]), parseFloat(vals[5]) ) );
                colorminx = Math.min(colorminx, parseFloat(vals[3]));
                colorminy = Math.min(colorminy, parseFloat(vals[4]));
                colorminz = Math.min(colorminz, parseFloat(vals[5]));

                colormaxx = Math.max(colormaxx, parseFloat(vals[3]));
                colormaxy = Math.max(colormaxy, parseFloat(vals[4]));
                colormaxz = Math.max(colormaxz, parseFloat(vals[5]));
            }
            /*this.minColor =  new THREE.Color(colorminx, colorminy, colorminz);
            this.maxColor =  new THREE.Color(colormaxx, colormaxy, colormaxz); */
            geometry = new TubeGeometry(
                vertexPosition,
                    totalVertexNum -1,
                0.5,
                6,
                false,
                vertexColor
            );
            geometry.uuid = i;
            //material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});
            material = new THREE.MeshPhongMaterial();
            mesh = new THREE.Mesh( geometry, material );

            object.add( mesh );

            startNum+=parseInt(totalVertexNum)+1;
        }
        return object;
    }

};

