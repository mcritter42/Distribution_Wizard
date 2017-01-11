using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Distribution_Wizard.Models;
using System.Dynamic;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

// Mark Ritter
namespace Distribution_Wizard.Controllers
{
    public class IndexController : Controller
    {
        private DistributionWizard_dbEntities2 db = new DistributionWizard_dbEntities2();

        // GET: Index
        public ActionResult Index()
        {
            //List<object> myModel = new List<object>();

            // var l = db.Clients.ToList();

            var employees = db.employees.ToList();

            //List<status_data> status_count = new List<status_data>();

            //myModel.Add(db.employees.ToList());
            //ViewBag.status_count = status_count.ToList();

            return View(employees);
            
        }

        public class status_data
        {
            public int total { get; set; }

            public string status { get; set; }
        }


        public ActionResult after_termination_employee_table(string terminated_employee_name, string terminated_employee_id)
        {

            int ID = Convert.ToInt32(terminated_employee_id);
            var employees = db.employees.ToList();

                var query = from emp in employees
                            where emp.Id != ID
                            select emp;

                var showTotal = from cust in db.Clients.ToList()
                                where cust.Salesperson_ID == ID
                                select cust;

                List<Distribution_Wizard.Models.employee> model = query.ToList();

                ViewBag.showTotal = showTotal.Count();
                ViewBag.termianted_name = terminated_employee_name;
                ViewBag.termianted_ID = terminated_employee_id;

            return View(model);
        }

        public class emp_info
        {
            public string ID { get; set; }

            public string percent { get; set; }
        }
        public ActionResult Submit(string json, string terminated_id, string total_clients)
        {
            
            int T_ID = Convert.ToInt32(terminated_id);
            int T_clients = Convert.ToInt32(total_clients);

            List<emp_info> list = JsonConvert.DeserializeObject<List<emp_info>>(json);

            foreach (var obj in list)
            {


                if (obj.percent != "")
                {
                    int count = Convert.ToInt32(Math.Ceiling((double)T_clients * (Convert.ToDouble(obj.percent) / 100)));
                    int int_id = Convert.ToInt32(obj.ID);

                    var query = (from cust in db.Clients
                                where cust.Salesperson_ID == T_ID
                                select cust).Take(count);
                    

                    foreach (Client cust in query)
                    {
                        cust.Salesperson_ID = int_id;
                    }

                    db.SaveChanges();
                }
                
            }

            //Remove the terminated employee from the employee table
            employee terminated_emp = db.employees.Find(T_ID);
            db.employees.Remove(terminated_emp);
            db.SaveChanges();       

            return View();
        }
    }
}