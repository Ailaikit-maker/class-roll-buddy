import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Finance = () => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Total Income",
      value: "R 2,847,650",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Monthly recurring revenue",
      color: "text-success"
    },
    {
      title: "Total Expenses", 
      value: "R 1,923,400",
      change: "+8.2%",
      trend: "up",
      icon: TrendingDown,
      description: "Operational costs",
      color: "text-warning"
    },
    {
      title: "Collection Rate",
      value: "87.3%",
      change: "-2.1%", 
      trend: "down",
      icon: Target,
      description: "Fee collection efficiency",
      color: "text-info"
    },
    {
      title: "Outstanding Fees",
      value: "R 456,789",
      change: "-15.7%",
      trend: "down",
      icon: AlertCircle,
      description: "Pending collections",
      color: "text-destructive"
    }
  ];

  const revenueBreakdown = [
    { category: "Tuition Fees", amount: "R 2,100,000", percentage: 73.7, color: "bg-success" },
    { category: "Registration Fees", amount: "R 287,650", percentage: 10.1, color: "bg-info" },
    { category: "Extra Curricular", amount: "R 215,000", percentage: 7.5, color: "bg-violet" },
    { category: "Transport Fees", amount: "R 155,000", percentage: 5.4, color: "bg-warning" },
    { category: "Other Income", amount: "R 90,000", percentage: 3.3, color: "bg-pink" }
  ];

  const expenseCategories = [
    { category: "Staff Salaries", amount: "R 1,200,000", percentage: 62.4, color: "bg-slate" },
    { category: "Utilities", amount: "R 285,000", percentage: 14.8, color: "bg-warning" },
    { category: "Maintenance", amount: "R 180,000", percentage: 9.4, color: "bg-info" },
    { category: "Learning Materials", amount: "R 158,400", percentage: 8.2, color: "bg-violet" },
    { category: "Administration", amount: "R 100,000", percentage: 5.2, color: "bg-pink" }
  ];

  const monthlyData = [
    { month: "Jan", income: 2650000, expenses: 1800000 },
    { month: "Feb", income: 2720000, expenses: 1850000 },
    { month: "Mar", income: 2847650, expenses: 1923400 },
    { month: "Apr", income: 2900000, expenses: 1950000 },
    { month: "May", income: 2780000, expenses: 1900000 },
    { month: "Jun", income: 2950000, expenses: 2000000 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Dashboard</h1>
            <p className="text-gray-600">Comprehensive financial analytics and reporting</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => {
            const IconComponent = kpi.icon;
            const TrendIcon = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight;
            
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {kpi.title}
                  </CardTitle>
                  <IconComponent className={`h-5 w-5 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="flex items-center mt-2">
                    <TrendIcon className={`h-4 w-4 mr-1 ${
                      kpi.trend === "up" ? "text-success" : "text-destructive"
                    }`} />
                    <span className={`text-sm ${
                      kpi.trend === "up" ? "text-success" : "text-destructive"
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Income vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Monthly Income vs Expenses
              </CardTitle>
              <CardDescription>6-month financial trend comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 text-sm font-medium">{data.month}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-success">Income</span>
                        <span>R {(data.income / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-success rounded-full h-2" 
                          style={{ width: `${(data.income / 3000000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-warning">Expenses</span>
                        <span>R {(data.expenses / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-warning rounded-full h-2" 
                          style={{ width: `${(data.expenses / 3000000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Collection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Fee Collection Status
              </CardTitle>
              <CardDescription>Current month collection breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">87.3%</div>
                  <div className="text-gray-600">Collection Rate</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-success mr-2" />
                      <span className="font-medium">Collected</span>
                    </div>
                    <span className="font-bold">R 2,390,861</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-warning mr-2" />
                      <span className="font-medium">Outstanding</span>
                    </div>
                    <span className="font-bold">R 456,789</span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress to target</span>
                      <span>87.3% of 90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-success rounded-full h-3 relative"
                        style={{ width: "87.3%" }}
                      >
                        <div className="absolute right-0 top-0 w-1 h-3 bg-gray-400 rounded-r-full" style={{ marginRight: "2.7%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue and Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Revenue Breakdown
              </CardTitle>
              <CardDescription>Income sources analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-bold">{item.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`${item.color} rounded-full h-2`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-12">{item.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Expense Breakdown
              </CardTitle>
              <CardDescription>Cost categories analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-bold">{item.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`${item.color} rounded-full h-2`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-12">{item.percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Finance;