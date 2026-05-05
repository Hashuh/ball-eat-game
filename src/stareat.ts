import {shader} from './shader_class';
import {vertice_rect_source, fragment_rect_source} from './shader';

interface star{
    radius:number;
    pos_x:number;
    pos_y:number;
    velo_x:number;
    velo_y:number;
    if_cal:boolean;//是否已经计算
    if_exist:boolean;
}

function find_min_dist(star_array:Array<star>, pos_x:number, pos_y:number):number
{
    let min_dist:number = 1.0;
    for(let i = 0;i < star_array.length;i ++)
    {
        const dist_x:number = pos_x - star_array[i].pos_x;
        const dist_y:number = pos_y - star_array[i].pos_y;
        const point_dist:number = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
        const cur_dist:number = point_dist - star_array[i].radius;

        min_dist = min_dist < cur_dist ? min_dist : cur_dist ;
    }

    return min_dist;
}

function main() {
        
    window.addEventListener("keydown", handle_keydown);
    window.addEventListener("keyup", handle_keyup);

    //像素大小初始化
    let screen_width = window.innerWidth;
    let screen_height = window.innerHeight;
    const canvas = document.querySelector("#glcanvas") as HTMLCanvasElement;
    if(canvas)
    {
        canvas.width = screen_width;
        canvas.height = screen_height;
    }




    //const canvas = document.querySelector("#glcanvas") as HTMLCanvasElement;
	if(!canvas)
	{
		return;
	}
	const gl = canvas.getContext("webgl2");


	if (!gl) {
		alert("无法初始化 WebGL2，你的浏览器、操作系统或硬件等可能不支持 WebGL2。");
		return;
	}

	gl.viewport(0, 0, screen_width, screen_height);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);


	//gl.enable(gl.DEPTH_TEST); //启用 深度检测
	//gl.depthFunc(gl.LEQUAL); //深度缓冲值 小于等于时 绘制像素


    //编译着色器
    const shaderProgram_rect = new shader(gl, vertice_rect_source, fragment_rect_source);

    //rect顶点属性
	const programInfo_rect = {
		program: shaderProgram_rect.shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram_rect.shaderProgram, "aPos"),
		},
		uniformLocations: {
			pos_offset: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "pos_offset"),
			scale: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "scale"),
            radius: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "radius"),
            len_hei_ratio: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "len_hei_ratio"),
		},
	};

    //顶点数据
    const VAO_rect = gl.createVertexArray();
    gl.bindVertexArray(VAO_rect);
    const VBO_rect = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO_rect);
    {
        const rect = [
            -1, -1, 
            -1, 1, 
            1, 1, 
            1, -1, 
        ];//顶点数据
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect), gl.STATIC_DRAW);

        gl.vertexAttribPointer(programInfo_rect.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo_rect.attribLocations.vertexPosition);
    }
    const EBO_rect = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO_rect);
    {
        const rect_indices = [0, 2, 1, 0, 3, 2];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rect_indices), gl.STATIC_DRAW);
    }


    //param
    const max_init_radius:number = 0.3;
    const min_init_radius:number = 0.02;
    const init_num_star:number = 100;
    //
    let star_array:Array<star> = new Array();
    //let num_star:number = init_num_star;


    //init
    
    for(let i = 0;i < init_num_star;i ++)
    {
        //todo
        if(i == 0)
        {
            star_array.push({
                radius:0.02,
                pos_x:0.0,
                pos_y:0.0,
                velo_x:0.0,
                velo_y:0.0,
                if_cal:false,//是否已经计算
                if_exist:true}
            );
        }
        else
        {
            while(true)
            {
                //random gen
                const rand_pos_x:number = (Math.random() * 2.0 - 1.0) * 0.5;
                const rand_pos_y:number = (Math.random() * 2.0 - 1.0) * 0.5;

                const min_dist:number = find_min_dist(star_array, rand_pos_x, rand_pos_y);

                if(min_dist >= min_init_radius)
                {
                    //radius:Math.min(Math.random() * (min_dist - min_init_radius) + min_init_radius , max_init_radius),
                        
                    star_array.push({
                        radius:Math.min(Math.random() * (min_dist - min_init_radius) + min_init_radius , max_init_radius),
                        pos_x:rand_pos_x,
                        pos_y:rand_pos_y,
                        velo_x:0.0,
                        velo_y:0.0,
                        if_cal:false,//是否已经计算
                        if_exist:true}
                    );

                    break;
                }
            }
        } 
    }

    //渲染循环
    let then = 0.0;
    let last_cam_scale = 0.0;
    function render(now:number) {
        if(!gl)
        {
            return;
        }

        now *= 0.001; // convert to seconds
        if(then == 0.0)
        {
            then = now;
        }
		const deltaTime = now - then;
		then = now;

        //大小变化计算
        let num_star:number = star_array.length;
        for(let i = 0;i < num_star;i ++)
        {
            if(star_array[i].if_exist && (!star_array[i].if_cal))
                for(let j = i + 1;j < num_star;j ++)
                {
                    if(star_array[j].if_exist && (!star_array[j].if_cal))
                    {
                        const dist_x:number = star_array[i].pos_x - star_array[j].pos_x;
                        const dist_y:number = star_array[i].pos_y - star_array[j].pos_y;
                        const distance_2:number = dist_x * dist_x + dist_y * dist_y;
                        const distance:number = Math.sqrt(distance_2);

                        //解方程计算 保持两者总面积不变
                        if(star_array[i].radius + star_array[j].radius > distance)
                        {
                            const total_vol:number = star_array[i].radius * star_array[i].radius +
                                                star_array[j].radius * star_array[j].radius;
                            const in_sqrt:number = 8.0 * total_vol - 4.0 * distance_2;

                            let result_sqrt:number = 0.0;
                            if(in_sqrt > 0)
                            {
                                result_sqrt = Math.sqrt(in_sqrt);
                            }

                            //解方程结果
                            const radius_larger:number = (2.0 * distance + result_sqrt) / 4.0;

                            
                            let index_radius_larger:number = i;
                            let index_radius_smaller:number = j;
                            if(star_array[i].radius < star_array[j].radius)
                            {
                                index_radius_larger = j;
                                index_radius_smaller = i;
                            }

                            //判断是否完全吞并
                            star_array[index_radius_larger].if_cal = true;
                            star_array[index_radius_smaller].if_cal = true;
                            if(radius_larger >= distance)
                            {
                                star_array[index_radius_larger].radius = Math.sqrt(total_vol);

                                star_array[index_radius_smaller].if_exist = false;
                            }
                            else
                            {
                                star_array[index_radius_larger].radius = radius_larger;
                                star_array[index_radius_smaller].radius = distance - radius_larger;
                            }
                            
                        }
                        

                    }
                    

                }
        }


        //判断是否存活
        if(star_array[0].if_exist == false)
        {
            //todo

        }


        //按键控制移动
        const move_speed:number = 0.1;
        if(w_down == 1)
			star_array[0].velo_y += move_speed * deltaTime;
		if(s_down == 1)
			star_array[0].velo_y -= move_speed * deltaTime;
		if(a_down == 1)
			star_array[0].velo_x -= move_speed * deltaTime;
		if(d_down == 1)
			star_array[0].velo_x += move_speed * deltaTime;


        const max_scale:number = 100.0;
        //相机位置
        const cam_pos_x:number = star_array[0].pos_x;
        const cam_pos_y:number = star_array[0].pos_y;
        //相机放大倍数
        const alpha:number = 0.01;//滤波器系数
        const cam_scale:number = Math.min(
            (0.3 * 1.0 / star_array[0].radius) * alpha + 
            last_cam_scale * (1.0 - alpha),
            max_scale
        );
        last_cam_scale = cam_scale;


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(programInfo_rect.program);
        

        //速度更新和渲染
        for(let i = 0;i < num_star;i ++)
        {
            

            if(star_array[i].if_exist)
            {
                star_array[i].pos_x += star_array[i].velo_x * deltaTime;
                star_array[i].pos_y += star_array[i].velo_y * deltaTime;

                //状态更新
                star_array[i].if_cal = false;

                gl.uniform2f(programInfo_rect.uniformLocations.pos_offset, 
                    star_array[i].pos_x-cam_pos_x, 
                    star_array[i].pos_y-cam_pos_y);
                gl.uniform1f(programInfo_rect.uniformLocations.len_hei_ratio, 1.0 * screen_height / screen_width);
                gl.uniform1f(programInfo_rect.uniformLocations.scale, cam_scale);
                gl.uniform1f(programInfo_rect.uniformLocations.radius, star_array[i].radius);
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            }
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

}



let w_down = 0;
let s_down = 0;
let a_down = 0;
let d_down = 0;
function handle_keydown(event:any){
	switch(event.code){
		case "KeyW":
		w_down = 1;
		break;
		case "KeyS":
		s_down = 1;
		break;
		case "KeyA":
		a_down = 1;
		break;
		case "KeyD":
		d_down = 1;
		break;
		
	}
}
function handle_keyup(event:any){
	switch(event.code){
		case "KeyW":
		w_down = 0;
		break;
		case "KeyS":
		s_down = 0;
		break;
		case "KeyA":
		a_down = 0;
		break;
		case "KeyD":
		d_down = 0;
		break;
		
	}
}

//事件监听
document.addEventListener("DOMContentLoaded", main);

	