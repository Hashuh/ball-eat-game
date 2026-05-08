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
	uniform vec2 pos_offset;
	uniform float radius;


	float my_projection(in float x)
	{
		float cos_2theta = sqrt(abs(1.0 - x * x));

		float sin_theta = sqrt((1.0 - cos_2theta) * 0.5) * sign(x);
		float cos_theta = sqrt((1.0 + cos_2theta) * 0.5);

		return sin_theta / cos_theta * 2.0;
	}


	//向量积 归一化 函数 计算法向量
	vec3 normal_cal(vec3 v1, vec3 v2){
		vec3 result_norm;
	
		result_norm.x = v1.y*v2.z-v1.z*v2.y;
		result_norm.y = v1.z*v2.x-v1.x*v2.z;
		result_norm.z = v1.x*v2.y-v1.y*v2.x;
	
		result_norm = normalize(result_norm);
	
		return result_norm;
	}

	//菲涅尔
	float fresnelSchlick(float cosTheta, float F0)
	{
		return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
	}

	//法线分布函数
	float D_GGX_TR(vec3 N, vec3 H, float a)
	{
		const float PI = 3.1415926;
		
		float a2     = a*a;
		float NdotH  = max(dot(N, H), 0.0);
		float NdotH2 = NdotH*NdotH;

		float nom    = a2;
		float denom  = (NdotH2 * (a2 - 1.0) + 1.0);
		denom        = PI * denom * denom;

		return nom / denom;
	}


	void main(){

		float dist = coord_tex.x * coord_tex.x + coord_tex.y * coord_tex.y;//距离中心距离
		
		// float bound_x = atan(coord_tex.x / coord_tex.y) + (-sign(coord_tex.y) * 0.5 + 0.5) * 3.1415926;

		// float ampli_bound = 0.0;//用于边界波浪
		// float maxampli_bound = 0.07;//幅值
		// float freq_bound = 4.0;
		// for(int i = 0;i < 16;i += 1){
		// 	float para_tri = (bound_x * radius * 20.0) * freq_bound  + iTime * freq_bound / 10.0;
		// 	//频率 幅度 更新
		// 	freq_bound *= 1.12;
		// 	maxampli_bound *= 0.85;
			
		// 	float tmp_sin = sin(para_tri);
		// 	float cur_ampli = maxampli_bound * exp(tmp_sin - 1.0);//此次循环计算的幅度值
			
		// 	ampli_bound += cur_ampli;
		// }

		if(dist > 1.0)
		{
			discard;
		}

		//获取坐标投影映射
		//目前使用简单平行投影
		//vec2 aPos = coord_tex;

		//球极投影
		vec2 aPos = vec2(my_projection(coord_tex.x), my_projection(coord_tex.y)) * radius * 3.0;

		//计算波浪
		float ampli = 0.0;//幅度
		vec2 gradiant_xz = vec2(0.0, 0.0);//斜率临时变量
		const float wave_direction[10] = float[10](1.0, 0.0, 
										0.8, 0.6,
										0.6, 0.8,
										12.0/13.0, 5.0/13.0,
										0.0, 1.0);
		const float coord[6] = float[6](1.0, 1.0,
								1.0, -1.0,
								-1.0, 1.0);
		const float freq_step = 1.12;//每次频率乘数
		const float ampli_step = 0.85;
		
		float freq = 4.0;//频率
		float maxampli = 0.07;//幅值

		for(int i = 0;i < 32;i += 1){
			vec2 samplepoint = -gradiant_xz * 0.02 + aPos;//采样点偏移 用于实现波浪推挤效果
			
			vec2 cur_direction = vec2(coord[(i * 2)%6] * wave_direction[(i * 2)%10],
								coord[(i * 2 + 1)%6] * wave_direction[(i * 2 + 1)%10]);
			
			float para_tri = (samplepoint.x * cur_direction.x +samplepoint.y * cur_direction.y) * freq  + iTime * freq / 10.0;
			//频率 幅度 更新
			freq *= freq_step;
			maxampli *= ampli_step;
			
			float tmp_sin = sin(para_tri);
			float cur_ampli = maxampli * exp(tmp_sin - 1.0);//此次循环计算的幅度值
			
			ampli += cur_ampli;
			
			gradiant_xz.x += cur_ampli * freq * cur_direction.x * cos(para_tri);
			gradiant_xz.y += cur_ampli * freq * cur_direction.y * cos(para_tri);
		}

		//平面上的法向量
		vec3 normal_plane = normal_cal(vec3(0.0, gradiant_xz.y, -1.0), vec3(1.0, gradiant_xz.x, 0.0));


		//旋转到球面上的法向量
		float sin_theta = coord_tex.y;
		float cos_theta = sqrt(abs(1.0 - coord_tex.y * coord_tex.y));
		float sin_phi = coord_tex.x;
		float cos_phi = sqrt(abs(1.0 - coord_tex.x * coord_tex.x));
		mat3 rot_theta = mat3(1.0, 0.0, 0.0, 0.0, cos_theta, -sin_theta, 0.0, sin_theta, cos_theta);
		mat3 rot_phi = mat3(cos_phi, 0.0, -sin_phi, 0.0, 1.0, 0.0, sin_phi, 0.0, cos_phi);
		vec3 normal = rot_phi * rot_theta * vec3(normal_plane.x, normal_plane.z, normal_plane.y);

		//光线计算
		vec3 position = vec3(pos_offset, sqrt(abs(1.0 - dist)));//tmp

		vec3 viewPos = vec3(0, 0, 2.0);//todo
		
		vec3 lightDir = vec3(0.7071, 0.0, 0.7071);//光源方向
		//vec3 reflectDir = reflect(-lightDir, normal);
		vec3 viewDir = normalize(viewPos - position);
		vec3 half_vec = normalize(lightDir + viewDir);//计算半程向量
		float mir = 0.1 * D_GGX_TR(-normal, half_vec, 0.01);
		//修改 增加菲涅尔效应
		mir = mir * fresnelSchlick(dot(viewDir, -normal), 0.02);
		
		//float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0) * 0.5 + 0.5;
		float env = max(dot(lightDir, -normal), 0.0);
		float back_env = 0.1;
		//float color_result = env*1.0 + mir*1.0;
		
		
		//高度渐变 模拟散射
		float height_wave = ampli + 0.35 - 0.5;
		
		vec3 color_tmp = vec3(back_env + env * 0.04 + mir - 1.4 * height_wave, 
					back_env + env * 0.277 + mir + 1.5 * height_wave, 
					back_env + env * 0.37 + mir + 0.75 * height_wave);



		FragColor = vec4(color_tmp, 1.0);
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
		// 粒子颜色
		FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	`;

//AI----------------------------------------------------end

export {vertice_rect_source, fragment_rect_source, vertice_particle_source, fragment_particle_source

};