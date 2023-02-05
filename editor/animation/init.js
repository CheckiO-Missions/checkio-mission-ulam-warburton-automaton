requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        function ulam_warburton_automaton_visualization(tgt_node, data) {

            if (!data || !data.ext) {
                return
            }

            const input = data.in[0]

            /*----------------------------------------------*
             *
             * attr
             *
             *----------------------------------------------*/
            const attr = {
                on_cell: {
                    'stroke-width': '0.1px',
                    'stroke': '#ffc965',
                    'fill': '#294270',
                },
                grid: {
                    'stroke-width': '0.5px',
                    'stroke': '#4094c7',
                },
            }

            /*----------------------------------------------*
             *
             * values
             *
             *----------------------------------------------*/
            const grid_size_px = 200
            const os = 15
            const unit = Math.min(12, grid_size_px / ((input-1)*2+1))
            const cx = grid_size_px / 2 + os
            const cy = grid_size_px / 2 + os

            /*----------------------------------------------*
             *
             * paper
             *
             *----------------------------------------------*/
            const paper = Raphael(tgt_node, grid_size_px + os*2, grid_size_px + +os*2, 0, 0)

            /*----------------------------------------------*
             *
             * (function) solution of this mission
             *
             *----------------------------------------------*/
             function automaton(step) {
                const on_cells = new Set([[0, 0].toString()])
                let new_cells = new Set([[0, 0].toString()])

                function adj_cells(x, y) {
                        const result = []
                        const coord_d = [[0, -1], [0, 1], [-1, 0], [1, 0]]
                        coord_d.forEach(([dx, dy])=>{
                            result.push([x+dx, y+dy].toString())
                        })
                        return result
                }

                for (let i = 0; i < step - 1; i += 1) {
                    const search_cells = new_cells
                    new_cells = new Set()
                    search_cells.forEach(s_coord=>{
                        const all_adj_cells = new Set()
                        const [sx, sy] = s_coord.split(',').map(x=>parseInt(x))
                        adj_cells(sx, sy).forEach(a_coord=>{
                            if (! on_cells.has(a_coord)) {
                                all_adj_cells.add(a_coord)
                            }
                        })
                        all_adj_cells.forEach(adj_coord=>{
                            const [jx, jy] = adj_coord.split(',').map(x=>parseInt(x))
                            let sum = 0
                            adj_cells(jx, jy).forEach(a_coord=>{
                                if (on_cells.has(a_coord)) {
                                    sum += 1
                                }
                            })
                            if (sum == 1) {
                                new_cells.add([jx, jy].toString())
                            }
                        })
                    })
                    new_cells.forEach(coords=>{
                        on_cells.add(coords)
                    })
                }
                return on_cells
            }

            /*----------------------------------------------*
             *
             * draw grid
             *
             *----------------------------------------------*/
            const half_length = (Math.max(8, input-1)+0.5) * unit
            const sx = cx - half_length
            const sy = cy - half_length
            for (let i = 0; i <= Math.max(17, input*2-1); i += 1) {
                paper.path(['M', sx, sy+i*unit, 'h', half_length * 2]).attr(attr.grid)
                paper.path(['M', sx+i*unit, sy, 'v', half_length * 2]).attr(attr.grid)
            }

            /*----------------------------------------------*
             *
             * draw cells
             *
             *----------------------------------------------*/
            automaton(input).forEach(coord=>{
                const [x, y] = coord.split(',').map(a=>parseInt(a))
                paper.rect(cx-(unit/2)+unit*x, cy-(unit/2)+unit*y, unit, unit).attr(attr.on_cell)
            })
        }

        var io = new extIO({
            animation: function($expl, data){
                ulam_warburton_automaton_visualization(
                    $expl[0],
                    data,
                );
            }
        });
        io.start();
    }
);
