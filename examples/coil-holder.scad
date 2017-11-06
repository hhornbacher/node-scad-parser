wallThickness=1.5;


module coilHolder(
    position=[0,0,0],
    holderSize=60,
    frameSize=16,
    frameHeight=10,
    screwHolderRadius=6.2,
    overlap=28,
    screwTubeHeight=8
) {
    module screwTube() {
        difference() {
            linear_extrude(height=screwTubeHeight, scale=0.6) {
                circle(r=8, $fn=48, center=true);
            }
            linear_extrude(height=screwTubeHeight+1) {
                circle(r=3.15, $fn=32, center=true);
            }
        }
    }
    module screwHolder() {
        translate([0, 0, -(frameHeight/2)+wallThickness]) {
            linear_extrude(height=frameHeight-(wallThickness*2)) {
                translate([(holderSize/2), 0, 0]) {
                        circle(r=screwHolderRadius, $fn=6);
                }
            }
            linear_extrude(height=frameHeight+5) {
                translate([(holderSize/2), 0, 0]) {
                        circle(r=3.25, $fn=64);
                }
            }
        }
    }

    module screwHole(
        dist=46.5
    ) {
        translate([0, 0, -(frameHeight/2)]) {
            translate([(dist), 0, 0]) {
                translate([0, 0, frameHeight-(frameHeight/3)]) {
                    linear_extrude(height=frameHeight/3, scale=2) {
                            circle(r=2.15, $fn=48, center=true);
                    }
                }
                linear_extrude(height=frameHeight) {
                    circle(r=2.15, $fn=64);
                }
            }
        }
    }


    translate(position) {
        difference() {
            union() {
                cube(size=[holderSize+(2*overlap), frameSize, frameHeight], center=true);
                cube(size=[frameSize, holderSize+(2*overlap), frameHeight], center=true);
                translate([0,0,((frameHeight+1.4)/2)]) {
                    cube(size=[holderSize, frameSize/3.5, frameHeight+1.4], center=true);
                    cube(size=[frameSize/3.5, holderSize, frameHeight+1.4], center=true);
                }
                rotate([0, 0, 45]) {
                    difference() {
                        cube(size=[holderSize, holderSize, frameHeight], center=true);
                        cube(size=[holderSize-5, holderSize-5, frameHeight], center=true);
                    }
                }    
                translate([(holderSize/2), 0, screwTubeHeight/2]) {
                    screwTube();
                } 
                rotate([0, 0, 90]) {
                    translate([(holderSize/2), 0, screwTubeHeight/2]) {
                        screwTube();
                    } 
                } 
                rotate([0, 0, 180]) {
                    translate([(holderSize/2), 0, screwTubeHeight/2]) {
                        screwTube();
                    } 
                } 
                rotate([0, 0, 270]) {
                    translate([(holderSize/2), 0, screwTubeHeight/2]) {
                        screwTube();
                    }
                } 
    
            }
            union() {
                screwHolder();
                screwHole();
                rotate([0, 0, 90]) {
                    screwHolder();
                    screwHole();
                }
                rotate([0, 0, 180]) {
                    screwHolder();
                    screwHole();
                }
                rotate([0, 0, 270]) {
                    screwHolder();
                    screwHole();
                }
                
            }
        }
    }
}


coilHolder();