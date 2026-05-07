//着色器代码


//默认缓冲用于渲染圆形的着色器
const vertice_rect_source: string = `#version 300 es
	precision mediump float;
	in vec2 aPos;//坐标
	out vec2 coord_tex;

	uniform vec2 pos_offset;
	uniform float radius;
	uniform float scale;
	uniform float len_hei_ratio;

	void main(){
		vec2 pos_global = (aPos * radius  + pos_offset) * scale;
		gl_Position = vec4(pos_global.x * len_hei_ratio, pos_global.y, 1.0, 1.0);
		coord_tex = aPos;
	}
	`;
const fragment_rect_source: string = `#version 300 es
	precision mediump float;
	in vec2 coord_tex;
	out vec4 FragColor;

	//uniform sampler2D Tex_hdr;
	//uniform sampler2D Tex_blur;

	uniform float iTime;

	// Star Nest by Pablo Roman Andrioli
// License: MIT

#define iterations 17
#define formuparam 0.53

#define volsteps 20
#define stepsize 0.1

#define zoom   0.800
#define tile   0.850
#define speed  0.010 

#define brightness 0.0015
#define darkmatter 0.300
#define distfading 0.730
#define saturation 0.850


void mainImage( out vec4 fragColor, in vec2 uv, in float iTime)
{
	//get coords and direction
	//vec2 uv=fragCoord.xy/iResolution.xy-.5;
	//uv.y*=iResolution.y/iResolution.x;
	vec3 dir=vec3(uv*zoom,1.);
	float time=iTime*speed+.25;

	//mouse rotation
	// float a1=.5+iMouse.x/iResolution.x*2.;
	// float a2=.8+iMouse.y/iResolution.y*2.;
	// mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
	// mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
	// dir.xz*=rot1;
	// dir.xy*=rot2;
	vec3 from=vec3(1.,.5,0.5);
	from+=vec3(time*2.,time,-2.);
	// from.xz*=rot1;
	// from.xy*=rot2;
	
	//volumetric rendering
	float s=0.1,fade=1.;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir*.5;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		float dm=max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a; // add contrast
		if (r>6) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v+=fade;
		v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v=mix(vec3(length(v)),v,saturation); //color adjust
	fragColor = vec4(v*.02,1.);	
	
}

	void main(){

		float dist = coord_tex.x * coord_tex.x + coord_tex.y * coord_tex.y;//距离中心距离
		if(dist > 1.0)
		{
			discard;
		}

		vec4 fromshadertoy;
		vec2 uv = vec2((coord_tex.x + 1.0) * 0.5, (coord_tex.y + 1.0) * 0.5);
		mainImage(fromshadertoy, uv, iTime);

		FragColor =  fromshadertoy;
	}
	`;


//AI----------------------------------------------------
// 粒子顶点着色器
const vertice_particle_source: string = `#version 300 es
	precision mediump float;
	in vec2 aPos;//坐标
	
	uniform vec2 pos_offset;
	uniform float scale;
	uniform float len_hei_ratio;
	uniform float size;

	void main(){
		// 计算粒子的世界位置
		vec2 pos_global = aPos * size + pos_offset;
		// 应用缩放和宽高比
		gl_Position = vec4(pos_global.x * len_hei_ratio * scale, pos_global.y * scale, 0.0, 1.0);
	}
	`;

// 粒子片段着色器
const fragment_particle_source: string = `#version 300 es
	precision mediump float;
	out vec4 FragColor;

	//uniform float alpha; // 透明度

	void main(){
		// 粒子颜色，使用半透明的橙色/黄色表示推进器火焰
		FragColor = vec4(1.0, 0.7, 0.3, 1.0);
	}
	`;

//AI----------------------------------------------------end

export {vertice_rect_source, fragment_rect_source, vertice_particle_source, fragment_particle_source

};