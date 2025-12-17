import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Charts Component
 * Accepts `chartData` prop which should be an array of { name: 'ClassName', score: 85 }
 */
const TeacherCharts = ({ chartData }) => {

    // Fallback if no data
    const displayData = chartData && chartData.length > 0 ? chartData : [
        { name: 'No Data', score: 0 }
    ];

    return (
        <Card className="border-none shadow-sm rounded-2xl p-6 h-full">
            <CardHeader className="p-0 mb-6">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold text-[#1A4D3E]">Class Performance (Avg)</CardTitle>
                    <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-[#1A4D3E] rounded-full"></span> Avg Score
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData} barSize={20}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A3AED0' }} interval={0} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(value) => [`${value}%`, 'Score']}
                        />
                        <Bar dataKey="score" fill="#1A4D3E" radius={[4, 4, 4, 4]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default TeacherCharts;
