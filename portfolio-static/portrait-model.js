import * as THREE from 'three';

// Authored parametric clay bust. All dimensions are local modelling units.
// Garment, face and visor are continuous surfaces rather than stacked primitives.
export function createPortrait() {
  const root = new THREE.Group();
  const chest = new THREE.Group(), neck = new THREE.Group(), head = new THREE.Group();
  root.add(chest); chest.add(neck); neck.add(head);
  neck.position.y = 1.35; head.position.y = .48;
  const skin = new THREE.MeshStandardMaterial({ color: 0xe4e3dd, roughness: .78 });
  const cloth = new THREE.MeshStandardMaterial({ color: 0xe1e0da, roughness: .95 });
  const seam = new THREE.MeshStandardMaterial({ color: 0xd7d6d0, roughness: .92 });
  const hair = new THREE.MeshStandardMaterial({ color: 0xdcdcd6, roughness: .84 });
  const frame = new THREE.MeshStandardMaterial({ color: 0xe9e9e3, roughness: .48 });
  const mesh = (parent, geometry, material, name) => {
    const item = new THREE.Mesh(geometry, material);
    item.name = name; item.castShadow = !/stitch|seam|glasses|visor-bound|eyelet/.test(name); item.receiveShadow = !/stitch|seam|glasses|visor-bound|eyelet/.test(name);
    parent.add(item); return item;
  };
  const ellipsoid = (parent, position, scale, material, name) => {
    const m = mesh(parent, new THREE.SphereGeometry(1, 40, 28), material, name);
    m.position.set(...position); m.scale.set(...scale); return m;
  };
  const curve = (points, closed = false) => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), closed, 'centripetal');
  const tube = (parent, points, radius, material, name, closed = false) =>
    mesh(parent, new THREE.TubeGeometry(curve(points, closed), 56, radius, 8, closed), material, name);
  const surface = (parent, cols, rows, fn, material, name) => {
    const vertices = [], indices = [];
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) vertices.push(...fn(i / cols, j / rows));
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i, b = a + cols + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); g.setIndex(indices); g.computeVertexNormals();
    return mesh(parent, g, material, name);
  };
  const gauss = (x, centre, width) => Math.exp(-(((x - centre) / width) ** 2));
  const smooth = THREE.MathUtils.smoothstep;

  // One continuous torso: a shoulder profile with low-frequency draping folds.
  const profile = curve([
    [1.02, -.62, .46], [1.16, -.20, .50], [1.22, .28, .51],
    [1.25, .65, .48], [1.14, .92, .41], [.83, 1.10, .35],
    [.48, 1.28, .29], [.29, 1.34, .255]
  ]);
  surface(chest, 160, 112, (u, v) => {
    const p = profile.getPoint(v), a = u * Math.PI * 2, x = Math.sin(a) * p.x;
    const front = Math.max(0, Math.cos(a));
    // Soft folds fan from the collar, gathering towards the arm seams.
    let fold = .012 * Math.sin(a * 19 + p.y * 3) + .008 * Math.sin(a * 31 - p.y * 5);
    for (const side of [-1, 1]) {
      const line = side * (.26 + (1.25 - p.y) * .34);
      fold += front ** 3 * (.024 * gauss(x, line, .047) - .018 * gauss(x, line + side * .055, .052));
      fold += front ** 2 * .018 * Math.sin(p.y * 23 + side * a * 6) * gauss(Math.abs(x), 1.05, .20);
    }
    fold += front ** 3 * (.035 * gauss(Math.abs(x), .96, .18) - .026 * gauss(Math.abs(x), .76, .065)) * (1 - smooth(p.y,.75,1.1));
    fold *= smooth(v, .04, .30) * (1 - smooth(v, .89, 1));
    return [Math.sin(a) * (p.x + fold), p.y, Math.cos(a) * (p.z + fold)];
  }, cloth, 'continuous-sweatshirt');
  // Raglan construction seams and tiny double topstitching.
  for (const side of [-1, 1]) {
    const points = [[side * .38,1.25,.22],[side*.61,1.08,.32],[side*.91,.83,.34],[side*1.12,.40,.27],[side*1.13,-.2,.23]];
    tube(chest, points, .0065, seam, 'raglan-seam');
    tube(chest, points.map(([x,y,z])=>[x+side*.018,y,z+.003]), .003, cloth, 'raglan-topstitch');
  }
  ellipsoid(neck, [0,-.02,0], [.245,.46,.235], skin, 'neck');

  // Draped hood shell: its rim runs from the chest, over the shoulders and around the neck.
  const hoodPath = curve([[0,.91,.49],[-.32,.99,.43],[-.48,1.24,.15],[-.42,1.43,-.16],[0,1.48,-.34],[.42,1.43,-.16],[.48,1.24,.15],[.32,.99,.43]], true);
  const hoodFrames = hoodPath.computeFrenetFrames(144, true);
  surface(chest, 32, 144, (u,v) => {
    const idx = Math.min(144,Math.round(v*144)), p=hoodPath.getPointAt(v), a=u*Math.PI*2;
    const width=.105+.055*(1-Math.cos(v*Math.PI*2))*.5;
    const wrinkle=.004*Math.sin(v*Math.PI*24+a*2)+.003*Math.sin(v*Math.PI*44);
    const n=hoodFrames.normals[idx],b=hoodFrames.binormals[idx];
    return p.clone().addScaledVector(n,Math.cos(a)*(width+wrinkle)).addScaledVector(b,Math.sin(a)*(.075+wrinkle*.6)).toArray();
  },cloth,'folded-hood');
  tube(chest, [[-.42,1.33,.23],[-.40,1.18,.39],[-.23,.99,.52],[0,.92,.57],[.23,.99,.52],[.40,1.18,.39],[.42,1.33,.23]], .0065, seam,'hood-edge-stitch');
  // Drawstring eyelets, braided strings and aglets.
  for (const side of [-1,1]) {
    const eyelet=mesh(chest,new THREE.TorusGeometry(.026,.006,8,24),frame,'drawstring-eyelet');eyelet.position.set(side*.21,1.0,.535);
    const points=[[side*.21,1.0,.55],[side*.22,.81,.55],[side*.25,.58,.56],[side*.22,.32,.55]];
    tube(chest,points,.012,cloth,'drawstring');
    const aglet=mesh(chest,new THREE.CapsuleGeometry(.014,.065,4,8),frame,'drawstring-tip');aglet.position.set(side*.22,.29,.55);aglet.rotation.z=side*.07;
  }
  // Kangaroo-pocket top edge, visible if the footer crop is relaxed.
  tube(chest,[[-.63,-.13,.45],[-.43,.06,.49],[0,.12,.52],[.43,.06,.49],[.63,-.13,.45]],.006,seam,'pocket-seam');

  // A single continuous face with broad cheek, jaw and nose volumes.
  const faceGeometry=new THREE.SphereGeometry(1,112,88), facePos=faceGeometry.attributes.position;
  for(let i=0;i<facePos.count;i++){
    const ux=facePos.getX(i),uy=facePos.getY(i),uz=facePos.getZ(i);
    let x=ux*.47*(uy<0?1+uy*.24:1),y=.24+uy*.69,z=uz*.425;
    if(uz>0){
      const forward=smooth(uz,0,.45);
      const nose=.095*gauss(x,0,.068)*gauss(y,.18,.18);
      const cheeks=.020*(gauss(x,.24,.13)+gauss(x,-.24,.13))*gauss(y,.12,.19);
      const brow=.008*gauss(y,.40,.08)*gauss(x,0,.32);
      z+=(nose+cheeks+brow)*forward;
    }
    facePos.setXYZ(i,x,y,z);
  }
  faceGeometry.computeVertexNormals();mesh(head,faceGeometry,skin,'smooth-sculpted-face');
  for(const side of [-1,1]){
    ellipsoid(head,[side*.463,.20,-.01],[.063,.137,.073],skin,'ear');
    tube(head,[[side*.48,.31,.02],[side*.505,.29,.042],[side*.51,.20,.048],[side*.494,.10,.03]],.012,skin,'ear-helix');
    tube(head,[[side*.49,.26,.047],[side*.484,.20,.058],[side*.487,.16,.043]],.008,skin,'ear-inner-fold');
  }

  // Short sculpted hair, concealed by the cap except at temples and back.
  // Each lock is tapered and elliptical, with shallow longitudinal ridges.
  function lock(points,width,depth,name){
    const c=curve(points),frames=c.computeFrenetFrames(32,false);
    surface(head,16,32,(u,v)=>{
      const idx=Math.min(32,Math.round(v*32)),p=c.getPointAt(v),a=u*Math.PI*2;
      const taper=Math.pow(Math.sin(Math.PI*(.08+.90*v)),.55)*(1-.5*v);
      const rib=1+.055*Math.cos(a*5+v*2);
      return p.clone().addScaledVector(frames.normals[idx],Math.cos(a)*width*taper*rib).addScaledVector(frames.binormals[idx],Math.sin(a)*depth*taper).toArray();
    },hair,name);
  }
  for(const side of [-1,1])for(let i=0;i<7;i++){
    const z=-.33+i*.083,drop=.34+.045*Math.sin(i*1.7);
    lock([[side*.37,.72,z],[side*.46,.61,z+.015],[side*.485,.46,z+.024],[side*.464,drop,z+.055]],.056,.027,'short-temple-lock');
  }
  for(let i=0;i<11;i++){
    const a=-1.10+i*.22,x=Math.sin(a)*.43,z=-Math.cos(a)*.39;
    lock([[x*.8,.65,z*.85],[x,.48,z],[x*1.02,.31,z*1.01]],.06,.028,'short-back-lock');
  }

  // Six-panel baseball crown with a softly squared front and stitched panel seams.
  const crownPoint=(a,v,offset=0)=>{
    const phi=(1-v)*Math.PI/2,r=Math.sin(phi),front=Math.max(0,Math.cos(a));
    const panel=.0035*Math.cos(a*6)*Math.sin(phi)**2;
    return [Math.sin(a)*(.52+panel+offset)*r,.62+Math.cos(phi)*.405,Math.cos(a)*(.50+panel+offset)*r+front*.025*r];
  };
  surface(head,128,56,(u,v)=>crownPoint(u*Math.PI*2,v),cloth,'six-panel-cap');
  for(let i=0;i<6;i++){
    const a=(i+.5)*Math.PI/3,points=Array.from({length:25},(_,j)=>crownPoint(a,j/26,.009));
    tube(head,points,.004,cloth,'cap-panel-seam');

  }
  ellipsoid(head,[0,1.026,0],[.036,.018,.036],cloth,'cap-top-button');
  tube(head,Array.from({length:65},(_,i)=>crownPoint(i/64*Math.PI*2,0,.001)),.012,cloth,'cap-band',true);
  // Ventilation embroidery, subtle and in the same clay palette.
  for(const side of [-1,1]){
    const vent=mesh(head,new THREE.TorusGeometry(.012,.0035,6,16),seam,'cap-eyelet');vent.position.set(side*.36,.81,.29);vent.rotation.y=side*.65;vent.rotation.x=-.4;
  }
  // Visor has an actual upper surface, lower surface and rounded perimeter.
  const visorPoint=(u,v,underside=false)=>{
    const a=(u*2-1)*1.20,inner=.46,outer=.79-.07*Math.abs(Math.sin(a)),r=inner+(outer-inner)*v;
    return [Math.sin(a)*r*.88,.626-.10*v+.055*Math.sin(a)**2-(underside?.024:0),Math.cos(a)*r+.035];
  };
  surface(head,72,20,(u,v)=>visorPoint(1-u,v),cloth,'visor-upper');
  surface(head,72,20,(u,v)=>visorPoint(u,v,true),cloth,'visor-under');
  const border=[];
  for(let i=0;i<=72;i++)border.push(visorPoint(i/72,1));
  for(let i=20;i>=0;i--)border.push(visorPoint(1,i/20));
  for(let i=72;i>=0;i--)border.push(visorPoint(i/72,0));
  for(let i=0;i<=20;i++)border.push(visorPoint(0,i/20));
  tube(head,border.map(([x,y,z])=>[x,y-.012,z]),.012,cloth,'visor-bound-edge',true);
  for(const v of [.38,.78])tube(head,Array.from({length:61},(_,i)=>{const p=visorPoint(.025+i/60*.95,v);p[1]+=.005;return p;}),.002,cloth,'visor-stitch-row');

  // Rounded acetate frames with bevelled rims, proper bridge and temple hinges.
  function rimShape(cx){
    const make=(w,h,r)=>{
      const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;
    };
    const shape=make(.382,.287,.085),hole=make(.334,.239,.068);shape.holes.push(new THREE.Path(hole.getPoints(36).reverse()));
    const g=new THREE.ExtrudeGeometry(shape,{depth:.022,bevelEnabled:true,bevelSize:.005,bevelThickness:.005,bevelSegments:3,steps:1,curveSegments:12});
    const m=mesh(head,g,frame,'bevelled-glasses-rim');m.position.set(cx,.30,.437);m.rotation.y=cx>0?-.045:.045;
  }
  rimShape(-.225);rimShape(.225);
  tube(head,[[-.045,.36,.464],[0,.388,.485],[.045,.36,.464]],.016,frame,'glasses-bridge');
  for(const side of [-1,1]){
    tube(head,[[side*.418,.36,.44],[side*.478,.37,.27],[side*.483,.365,-.06],[side*.475,.30,-.15]],.014,frame,'glasses-temple');
    const hinge=mesh(head,new THREE.BoxGeometry(.026,.025,.038),frame,'glasses-hinge');hinge.position.set(side*.425,.36,.438);
  }
  root.scale.setScalar(1.13);
  root.rotation.y = -.16;
  return {root,bones:[chest,neck,head]};
}





