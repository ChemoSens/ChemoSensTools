using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.Serialization;

namespace TimeSens.webservices.models
{
    public class ExperimentalDesignItem
    {
        public string Code;
        public dynamic[] Labels;
        public int DefaultRank;
        public string LongName;
        public string Color;
        public string ImageURL;
        public string Description;
        public string Notes;
    }

    public class ExperimentalDesign
    {
        public ExperimentalDesignItem[] ListItems;

        public enum TypeEnum { Product, Attribute, ProductPair, TriangleTest, None }
        public enum OrderEnum { Fixed, Random, LatinSquare, Custom }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }

        public bool DefinedByPanelist { get; set; }

        [IgnoreDataMember]
        public bool HasChanges { get; set; }

        public int MaxReplicates { get; set; }

        public ObservableCollection<ItemLabel> ListItemLabels { get; set; }

        private ObservableCollection<ExperimentalDesignRow> listExperimentalDesignRows;
        public ObservableCollection<ExperimentalDesignRow> ListExperimentalDesignRows
        {
            get { return listExperimentalDesignRows; }
            set
            {
                listExperimentalDesignRows = value;
                this.OnPropertyChanged("ListExperimentalDesignRows");
            }
        }

        
        public int Seed { get; set; }

        public bool HasReplicates
        {
            get { return nbReplicates > 1; }
        }

        public int NbIntakes;

        private int nbReplicates;
        public int NbReplicates
        {
            get { return nbReplicates; }
            set
            {
                nbReplicates = value;
                if (nbReplicates <= 0)
                {
                    nbReplicates = 1;
                }
                if (nbReplicates == 1)
                {
                    ReplicateMode = "Successive";
                    this.OnPropertyChanged("ReplicateMode");
                }
                this.OnPropertyChanged("NbReplicates");
                this.OnPropertyChanged("HasReplicates");
            }
        }

        private string order;
        public string Order
        {
            get { return order; }
            set
            {
                order = value;
                this.OnPropertyChanged("Order");
                this.OnPropertyChanged("IsFixedOrder");
                this.OnPropertyChanged("IsRandomOrder");
                this.OnPropertyChanged("IsLatinSquareOrder");
            }
        }

        private string replicateMode;
        public string ReplicateMode
        {
            get { return replicateMode; }
            set
            {
                replicateMode = value;
                this.OnPropertyChanged("ReplicateMode");
                this.OnPropertyChanged("IsSuccessiveReplicateMode");
                this.OnPropertyChanged("IsRandomReplicateMode");
                this.OnPropertyChanged("IsSequentialReplicateMode");
            }
        }

        public bool IsAttributeExperimentalDesign
        {
            get { return this.Type == TypeEnum.Attribute.ToString(); }
        }

        public bool IsProductExperimentalDesign
        {
            get { return this.Type == TypeEnum.Product.ToString(); }
        }

        private bool isWithoutReplacement;
        public bool IsWithoutReplacement
        {
            get { return isWithoutReplacement; }
            set
            {
                isWithoutReplacement = value;
                this.OnPropertyChanged("IsWithoutReplacement");
            }
        }

        private bool isWilliamsLatinSquare;
        public bool IsWilliamsLatinSquare
        {
            get { return isWilliamsLatinSquare; }
            set
            {
                isWilliamsLatinSquare = value;
                this.OnPropertyChanged("IsWilliamsLatinSquare");
            }
        }

        private bool keepRanksBetweenReplicates;
        public bool KeepRanksBetweenReplicates
        {
            get { return keepRanksBetweenReplicates; }
            set
            {
                keepRanksBetweenReplicates = value;
                this.OnPropertyChanged("KeepRanksBetweenReplicates");
            }
        }

        private bool noConsecutiveItems;
        public bool NoConsecutiveItems
        {
            get { return noConsecutiveItems; }
            set
            {
                noConsecutiveItems = value;
                this.OnPropertyChanged("NoConsecutiveItems");
            }
        }

        #region INotifyPropertyChanged
        public void OnPropertyChanged(string propertyName)
        {
            this.OnPropertyChanged(new PropertyChangedEventArgs(propertyName));
        }

        protected virtual void OnPropertyChanged(PropertyChangedEventArgs args)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, args);
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        public delegate void ChangedEventHandler(object sender, EventArgs e);
        public event ChangedEventHandler Changed;
        protected virtual void OnChanged(EventArgs e)
        {
            if (Changed != null)
                Changed(this, e);
        }

        #endregion,

        public int NbItems
        {
            get
            {
                return ((from x in this.ListItemLabels select x.Code).Distinct().Count());
            }
        }

        public string Labels
        {
            get
            {
                return String.Join(", ", ((from x in this.ListItemLabels select x.Label).Distinct()));
            }
        }

        #region Order

        public bool IsCustomOrder
        {
            get { return this.order == OrderEnum.Custom.ToString(); }
        }

        public bool IsFixedOrder
        {
            get { return this.order == OrderEnum.Fixed.ToString(); }
        }

        public bool IsRandomOrder
        {
            get { return this.order == OrderEnum.Random.ToString(); }
        }

        public bool IsLatinSquareOrder
        {
            get { return this.order == OrderEnum.LatinSquare.ToString(); }
        }

        public bool IsWilliamsLatinSquareOrder
        {
            get { return this.order == OrderEnum.LatinSquare.ToString() && this.IsWilliamsLatinSquare == true; }
        }

        public bool CanHaveRandomLabels
        {
            get
            {
                if (Type == "Product" || Type == "TriangleTest")
                {
                    return true;
                }
                return false;
            }
        }


        [IgnoreDataMember]
        public bool CanBeCustomOrder
        {
            get { return (this.Type == "Product" || this.Type == "Attribute" || this.Type == "TriangleTest"); }
        }


        [IgnoreDataMember]
        public bool CanBeFixedOrder
        {
            get { return (this.Type == "Product" || this.Type == "Attribute" || this.Type == "TriangleTest"); }
        }


        [IgnoreDataMember]
        public bool CanBeRandomOrder
        {
            get { return true; }
        }


        [IgnoreDataMember]
        public bool CanBeLatinSquareOrder
        {
            get { return (this.Type == "Product" || this.Type == "TriangleTest"); }
        }

        #endregion

        #region ReplicateMode

        public bool IsSuccessiveReplicateMode
        {
            get { return this.replicateMode == "Successive"; }
        }

        public bool IsShuffleReplicateMode
        {
            get { return this.replicateMode == "Shuffle"; }
        }

        public bool IsSequentialReplicateMode
        {
            get { return this.replicateMode == "Sequential"; }
        }

        #endregion

        #region Type

        public bool IsTriangleTest
        {
            get { return this.Type == "TriangleTest"; }
        }

        #endregion

        public ExperimentalDesign()
        {
            Name = "";
            Type = TypeEnum.None.ToString();
            Order = OrderEnum.Fixed.ToString();
            NbReplicates = 1;
            ListExperimentalDesignRows = new ObservableCollection<ExperimentalDesignRow>();
            ListItemLabels = new ObservableCollection<ItemLabel>();
            HasChanges = false;
            MaxReplicates = 100;
            KeepRanksBetweenReplicates = false;
            noConsecutiveItems = false;
            isWilliamsLatinSquare = true;
            isWithoutReplacement = true;
            Seed = DateTime.Now.Millisecond;
            DefinedByPanelist = false;
        }

        #region Items



        private void setFixedListItemRanks()
        {
            // MAJ des rangs
            if (this.IsSuccessiveReplicateMode)
            {
                // P1 P2 P3 - P1 P2 P3
                this.ListItemLabels = new ObservableCollection<ItemLabel>(this.ListItemLabels.OrderBy(x => x.Replicate).ThenBy(x => x.DefaultRank));
            }
            if (this.IsSequentialReplicateMode)
            {
                // P1 P1 - P2 P2 - P3 P3
                var itemRanks = (from x in this.ListItemLabels
                                 orderby x.DefaultRank
                                 select x.Code).Distinct().ToList();
                this.ListItemLabels.All(x => { x.DefaultRank = itemRanks.IndexOf(x.Code); return true; });
                this.ListItemLabels = new ObservableCollection<ItemLabel>(this.ListItemLabels.OrderBy(x => x.DefaultRank).ThenBy(x => x.Replicate));
            }
            if (this.IsShuffleReplicateMode)
            {
                Random rnd = new Random(this.Seed);
                this.ListItemLabels = new ObservableCollection<ItemLabel>(this.ListItemLabels.OrderBy(x => rnd.Next()));
            }

            // Shuffle = Successive

            // Nouveau rang
            int newRank = this.ListItemLabels.Where(x => x.Warmup == true).Count() + 1;
            this.ListItemLabels.Where(x => x.Warmup == false).All(x => { x.DefaultRank = newRank; newRank++; return true; });

            // Liste de répétitions consécutives
            if (noConsecutiveItems == true)
            {
                List<IntIntPair> listPairs = getListSuccessiveReplicates();
                foreach (IntIntPair pair in listPairs)
                {
                    var item1 = (from x in this.ListItemLabels
                                 where x.Replicate == pair.I1
                                 orderby x.DefaultRank
                                 select x).Last();
                    var item2 = (from x in this.ListItemLabels
                                 where x.Replicate == pair.I2
                                 orderby x.DefaultRank
                                 select x).First();
                    if (item2.Code == item1.Code)
                    {
                        var items3 = (from x in this.ListItemLabels
                                      where x.Replicate == pair.I2
                                      orderby x.DefaultRank
                                      select x);
                        if (items3.Count() > 1)
                        {
                            var item4 = items3.ElementAt(1);
                            int memory = item4.DefaultRank;
                            item4.DefaultRank = item2.DefaultRank;
                            item2.DefaultRank = memory;
                        }
                    }
                }
            }

            this.HasChanges = true;
        }

        private void setCustomListItemRanks()
        {
            this.ListItemLabels = new ObservableCollection<ItemLabel>(this.ListItemLabels.OrderBy(x => x.Replicate).ThenBy(x => x.DefaultRank));
            int newRank = this.ListItemLabels.Where(x => x.Warmup == true).Count() + 1;
            this.ListItemLabels.Where(x => x.Warmup == false).All(x => { x.DefaultRank = newRank; newRank++; return true; });
            this.HasChanges = true;
        }

        public void RemoveItem(string code)
        {
            try
            {
                // Contient un item avec le même code ?
                var existingItems = new List<ItemLabel>(from x in this.ListItemLabels
                                                        where x.Code == code
                                                        select x).ToList();
                if (existingItems.Count > 0)
                {
                    foreach (ItemLabel item in existingItems)
                    {
                        // Suppression des anciens items avec le même code
                        this.ListItemLabels.Remove(item);
                    }

                    this.OnPropertyChanged("NbItems");
                    this.OnPropertyChanged("Labels");
                    this.OnPropertyChanged("ListItemRanks");
                    this.HasChanges = true;
                }
            }
            catch (Exception ex)
            {

            }
        }

        public bool SetItemLabel(ItemLabel item, string newLabel)
        {
            try
            {
                // Vérification : aucun autre code avec le même label
                bool isOk = (from x in ListItemLabels
                             where x.Code != item.Code
                             && x.Label == newLabel
                             select x).Count() == 0;

                if (isOk)
                {
                    item.Label = newLabel;
                    this.OnPropertyChanged("ListItemRanks");
                    Update();
                }

                return isOk;
            }
            catch
            {
                return false;
            }
        }

        public void SetItemRank(ItemLabel item, int oldRank)
        {
            try
            {
                // Item avec le même rang
                var items = (from x in this.ListItemLabels
                             where x != item
                             && x.DefaultRank == item.DefaultRank
                             select x);
                if (items.Count() > 0)
                {
                    items.First().DefaultRank = oldRank;
                }

                // TODO : Mode séquentiel : MAJ tous les codes
                if (this.IsSequentialReplicateMode)
                {
                    //var allItems = (from x in this.ListItemLabels
                    //                where x.Code == item.Code
                    //                && x != item
                    //                select x);
                    //foreach (ItemLabel il in allItems)
                    //{
                    //    il.DefaultRank = item.DefaultRank;

                    //}
                }

                this.OnPropertyChanged("ListItemRanks");
                Update();
            }
            catch
            {
            }
        }

        public bool Update()
        {
            bool res = setListExperimentalDesignRowRanks();
            this.HasChanges = false;
            return res;
        }

        /// <summary>
        /// Création (ou recréation) d'un nouveau plan de présentation
        /// </summary>
        /// <param name="listSubjectCodes">Liste des codes sujets</param>
        /// <param name="newSeed">Génération d'un nouveau seed</param>
        public bool Create(List<string> listSubjectCodes = null, bool newSeed = false)
        {
            if (newSeed)
            {
                Seed = DateTime.Now.Millisecond;
            }
            if (listSubjectCodes == null)
            {
                // Codes déjà existant
                listSubjectCodes = GetListSubjectCodes();
            }
            bool res = createExperimentalDesign(listSubjectCodes);
            this.HasChanges = false;
            return res;
        }

        private bool createExperimentalDesign(List<string> listSubjectCodes)
        {
            switch (this.Type)
            {
                case "Product":
                    CreateProductExperimentalDesign(listSubjectCodes);
                    break;
                case "Attribute":
                    CreateAttributeExperimentalDesign(listSubjectCodes);
                    break;
                case "TriangleTest":
                    CreateTriangleTestExperimentalDesign(listSubjectCodes);
                    break;
            }
            bool res = setListExperimentalDesignRowRanks();
            return res;
        }

        /// <summary>
        /// MAJ du type de plan de présentation
        /// Création d'un nouveau plan
        /// </summary>
        /// <param name="order"></param>
        public bool SetOrder(string order)
        {
            this.Order = order;
            this.OnPropertyChanged("IsProductExperimentalDesign");
            this.OnPropertyChanged("IsAttributeExperimentalDesign");
            this.OnPropertyChanged("IsTriangleTest");
            if (this.IsFixedOrder)
            {
                setFixedListItemRanks();
            }
            bool res = this.Create();
            return res;
        }

        private bool setListExperimentalDesignRowRanks()
        {
            bool res = true;
            if (this.Type == TypeEnum.Product.ToString() || this.Type == TypeEnum.Attribute.ToString() || this.Type == TypeEnum.TriangleTest.ToString())
            {
                if (order == "Custom")
                {
                    res = setCustomListExperimentalDesignRows();
                }
                if (order == "Fixed")
                {
                    res = setFixedListExperimentalDesignRows();
                }
                if (order == "Random")
                {
                    res = setRandomListExperimentalDesignRows();
                }
                //if (order == "LatinSquare")
                //{
                //    res = setLatinSquareListExperimentalDesignRows();
                //}
            }
            OnChanged(EventArgs.Empty);
            return res;
        }

        [IgnoreDataMember]
        public List<int> ListItemRanks
        {
            get { return (from x in this.ListItemLabels select x.DefaultRank).OrderBy(x => x).ToList(); }
        }

        #endregion

        #region TriangleTest

        public static ExperimentalDesign CreateProductExperimentalDesign(List<string> listSubjectCodes, ObservableCollection<ItemLabel> listProducts, string order, int nbReplicates, int id, string name, string replicateMode)
        {
            ExperimentalDesign design = new ExperimentalDesign();
            if (order == "WilliamsLatinSquare")
            {
                design.Order = "LatinSquare";
                design.IsWilliamsLatinSquare = true;
            }
            else
            {
                design.Order = order;
            }
            design.NbReplicates = nbReplicates;
            design.Id = id;
            design.Name = name;
            design.ReplicateMode = replicateMode;
            design.Type = "Product";
            //design.Seed
            //design.RandomStringGenerator
            //design.NoConsecutiveItems
            //design.KeepRanksBetweenReplicates

            design.ListItemLabels = listProducts;

            design.CreateProductExperimentalDesign(listSubjectCodes);

            design.Update();
            return design;
        }

        public void CreateTriangleTestExperimentalDesign(List<string> listSubjectCodes)
        {
            //ObservableCollection<TriangleTestExperimentalDesignRow> copy = getOldListTriangleTestExperimentalDesignRow(); ;

            List<ProductPairWithLabels> listProducts = new List<ProductPairWithLabels>();
            foreach (ItemLabel item in this.ListItemLabels)
            {
                ProductPairWithLabels pp = new ProductPairWithLabels();
                try
                {
                    string[] codes = item.Code.Split('|');
                    string[] labels = item.Label.Split('|');
                    pp.ProductCode1 = codes[0];
                    pp.ProductCode2 = codes[1];
                    pp.LabelProduct1As1 = labels[0];
                    pp.LabelProduct1As2 = labels[1];
                    pp.LabelProduct2As1 = labels[2];
                    pp.LabelProduct2As2 = labels[3];
                    pp.Replicate = item.Replicate;
                }
                catch
                {

                }
                listProducts.Add(pp);
            }
            ExperimentalDesign ed = CreateTriangleTestExperimentalDesign(listSubjectCodes, listProducts, this.Order, this.NbReplicates, this.Id, this.Name, this.Seed);
            this.ListExperimentalDesignRows = ed.listExperimentalDesignRows;
            this.ListItemLabels = ed.ListItemLabels;
        }

        public static ExperimentalDesign CreateTriangleTestExperimentalDesign(List<string> listSubjectCodes, List<ProductPairWithLabels> listProductPairs, string order, int nbReplicates, int id, string name, int seed = 0)
        {
            ExperimentalDesign ed = new ExperimentalDesign();
            ed.Id = id;
            ed.ListExperimentalDesignRows = new ObservableCollection<ExperimentalDesignRow>();
            ed.Name = name;
            ed.NbReplicates = nbReplicates;
            ed.Order = order;
            ed.Type = "TriangleTest";

            Random rnd = new Random();
            if (seed > 0)
            {
                rnd = new Random(seed);
            }

            // Ordre de présentation de chaque paire de produits
            ObservableCollection<ItemLabel> listProducts = new ObservableCollection<ItemLabel>();
            int defaultRank = 1;
            foreach (ProductPairWithLabels pp in listProductPairs)
            {
                listProducts.Add(new ItemLabel() { Code = pp.GetPair(), DefaultRank = defaultRank, Label = pp.GetLabel(), Replicate = pp.Replicate, Warmup = false });
                defaultRank++;
            }

            ed.ListItemLabels = listProducts;

            ExperimentalDesign productDesign = CreateProductExperimentalDesign(listSubjectCodes, listProducts, order, nbReplicates, 0, "Product pairs design", "Successive");

            foreach (ProductPairWithLabels pp in listProductPairs)
            {
                int currentTriangle = 0;
                int currentSubjectIndex = 0;

                // On génère les 6 combinaisons possibles
                List<ProductTriangle> list = ProductTriangle.GenerateAllProductTriangles(pp);

                for (int i = 1; i <= nbReplicates; i++)
                {
                    while (currentSubjectIndex < listSubjectCodes.Count())
                    {
                        if (currentTriangle == 0)
                        {
                            // On randomise
                            list = list.OrderBy(x => rnd.Next()).ToList();
                        }
                        if (currentTriangle == 5)
                        {
                            // On a fait le tour des combinaisons : on en recrée une
                            currentTriangle = 0;
                        }
                        TriangleTestExperimentalDesignRow row = new TriangleTestExperimentalDesignRow();
                        row.SubjectCode = listSubjectCodes.ElementAt(currentSubjectIndex);
                        row.Combination = list.ElementAt(currentTriangle).Combination;
                        row.Replicate = i;
                        row.ProductCode1 = list.ElementAt(currentTriangle).ProductCode1;
                        row.ProductCode2 = list.ElementAt(currentTriangle).ProductCode2;
                        row.ProductCode3 = list.ElementAt(currentTriangle).ProductCode3;
                        row.ProductLabel1 = list.ElementAt(currentTriangle).ProductLabel1;
                        row.ProductLabel2 = list.ElementAt(currentTriangle).ProductLabel2;
                        row.ProductLabel3 = list.ElementAt(currentTriangle).ProductLabel3;

                        // Rang correspondant dans le plan de présentation des produits
                        var ranks = (from x in productDesign.listExperimentalDesignRows
                                     where x.SubjectCode == row.SubjectCode
                                     && x.Replicate == row.Replicate
                                     && ((ProductExperimentalDesignRow)x).ProductCode == pp.GetPair()
                                     select x.Rank);
                        if (ranks.Count() > 0)
                        {
                            row.Rank = ranks.First();
                        }

                        ed.ListExperimentalDesignRows.Add(row);
                        row.UploadId = 1;
                        currentSubjectIndex++;

                    }
                }
            }

            return ed;
        }



        //public static List<ProductTriangle> GenerateAllTriangles(List<string> products)
        //{
        //    // Construit tous les triangles possibles pour chaque paire de produit
        //    // Total : 6 * nb de paires de produits
        //    List<ProductTriangle> triangles = new List<ProductTriangle>();
        //    List<ProductPair> pairs = GenerateAllProductPairs(products);
        //    foreach (ProductPair pair in pairs)
        //    {
        //        List<ProductTriangle> list = ProductTriangle.GenerateAllProductTriangles(pair.ProductCode1, pair.ProductCode2, ProductTriangle.Combinations);
        //        foreach (ProductTriangle triangle in list)
        //        {
        //            triangles.Add(triangle);
        //        }
        //    }
        //    return triangles;
        //}

        /// <summary>
        /// Génère un plan de présentation de produits
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="listSubjectCodes"></param>
        /// <param name="listProductCodes"></param>
        /// <returns></returns>
        //public void CreateTriangleTestExperimentalDesign(List<string> listSubjectCodes)
        //{
        //    ListExperimentalDesignRows = new ObservableCollection<ExperimentalDesignRow>();
        //    //TODO

        //    //// Toutes les paires de produit
        //    //List<string> listProducts = (from x in listProductCodes select x.Key).ToList();
        //    //List<ProductPair> pairs = GenerateAllProductPairs(listProducts);

        //    //// Tous les triangles possibles pour un juge
        //    //List<ProductTriangle> triangles = GenerateAllTriangles(listProducts);

        //    //// Sélection de n (répétitions) triangles pour chaque juge par paire de produit
        //    //// Au niveau du panel, toutes les combinaisons doivent être équilibrées (AAB BBA...)
        //    //foreach (string subjectCode in listSubjectCodes)
        //    //{
        //    //    int rank = 1;
        //    //    foreach (ProductPair pair in pairs.OrderBy(a => Guid.NewGuid()).ToList())
        //    //    {
        //    //        foreach (int rep in listReplicates)
        //    //        {
        //    //            ProductTriangle triangle = triangles.OrderBy(a => Guid.NewGuid()).ToList().Where(x => IsProductPairOf(x, pair)).First();



        //    //            // Création de la nouvelle ligne
        //    //            TriangleTestExperimentalDesignRow row = new TriangleTestExperimentalDesignRow();
        //    //            row.SubjectCode = subjectCode;
        //    //            row.Replicate = rep;
        //    //            row.ProductCode1 = triangle.ProductCode1;
        //    //            row.ProductCode2 = triangle.ProductCode2;
        //    //            row.ProductCode3 = triangle.ProductCode3;
        //    //            row.ProductLabel1 = (listProductCodes.Where(x => x.Key == triangle.ProductCode1)).First().Value;
        //    //            row.ProductLabel2 = (listProductCodes.Where(x => x.Key == triangle.ProductCode2)).First().Value;
        //    //            row.ProductLabel3 = (listProductCodes.Where(x => x.Key == triangle.ProductCode3)).First().Value;
        //    //            row.Combination = triangle.Combination;
        //    //            row.UploadId = 1;
        //    //            row.Rank = rank;
        //    //            this.ListExperimentalDesignRows.Add(row);

        //    //            // Suppression du triangle
        //    //            triangles.Remove(triangle);

        //    //            // Nouveau triangle si on est arrivé au bout
        //    //            if (triangles.Count == 0)
        //    //            {
        //    //                triangles = GenerateAllTriangles(listProducts);
        //    //            }

        //    //            rank++;
        //    //        }
        //    //    }
        //    //}
        //}

        /// <summary>
        /// Teste si un triangle est une combinaison d'une paire
        /// </summary>
        /// <param name="triangle"></param>
        /// <param name="pair"></param>
        /// <returns></returns>
        //public static bool IsProductPairOf(ProductTriangle triangle, ProductPair pair)
        //{
        //    List<ProductTriangle> authorizedTriangles = GenerateAllTriangles(new List<string>() { pair.ProductCode1, pair.ProductCode2 });
        //    return (from x in authorizedTriangles
        //            where x.ProductCode1 == triangle.ProductCode1
        //            && x.ProductCode2 == triangle.ProductCode2
        //            && x.ProductCode3 == triangle.ProductCode3
        //            select x).Count() > 0;
        //}

        //public bool CheckTriangleTestDesign()
        //{
        //    // Chaque sujet doit voir toutes les paires de produit replicate fois
        //    // Toutes les combinaisons (AAB, BBA) doivent être représentées équitablement
        //    // Les rangs doivent être uniques

        //    List<ProductPair> pairs = GenerateAllProductPairs(this.GetListProductCodes());
        //    List<string> subjects = this.GetListSubjectCodes();
        //    List<int> replicates = this.GetListReplicates();

        //    foreach (string subject in subjects)
        //    {
        //        foreach (int replicate in replicates)
        //        {
        //            var selectedRows = (from x in ListExperimentalDesignRows
        //                                where x.SubjectCode == subject
        //                                && x.Replicate == replicate
        //                                select x);

        //            // Toutes les paires ont été vues ?
        //            foreach (ProductPair pair in pairs)
        //            {
        //                var cpt = (from x in selectedRows
        //                           where ((TriangleTestExperimentalDesignRow)x).GetPair() == pair.GetPair()
        //                           select x).Count();
        //                if (cpt != 1)
        //                {
        //                    return false;
        //                }
        //            }

        //            // Rangs uniques ?
        //            if (selectedRows.Distinct().Count() != pairs.Count)
        //            {
        //                return false;
        //            }
        //        }
        //    }

        //    // Combinaisons uniformément réparties
        //    var combCounts = from x in ListExperimentalDesignRows
        //                     group x by ((TriangleTestExperimentalDesignRow)x).Combination into g
        //                     select new { Combination = g.Key, Count = g.Count() };
        //    int min = (from x in combCounts
        //               select x.Count).Min();
        //    int max = (from x in combCounts
        //               select x.Count).Max();
        //    if (max - min > 2)
        //    {
        //        return false;
        //    }

        //    return true;
        //}


        ///// <summary>
        ///// Génère un plan de présentation de type TriangleTest
        ///// </summary>
        ///// <param name="name"></param>
        ///// <param name="listSubjectCodes"></param>
        ///// <param name="listProductCodes"></param>
        ///// <param name="nbReplicates"></param>
        ///// <returns></returns>
        //public static ExperimentalDesign GenerateDefaultTriangleTestExperimentalDesign(int id, string name, List<string> listSubjectCodes, List<KeyValuePair<string, string>> listProductCodes)
        //{
        //    ExperimentalDesign ed = new ExperimentalDesign();
        //    ed.Id = id;
        //    ed.Type = TypeEnum.TriangleTest.ToString();
        //    ed.Name = name;
        //    ed.ListExperimentalDesignRows = new ObservableCollection<ExperimentalDesignRow>();
        //    ed.NbReplicates = 6;
        //    ed.MaxReplicates = 6;
        //    List<string> listCombinations = new List<string>() { "AAB", "ABA", "BAA", "BBA", "BAB", "ABB" };
        //    List<int> listReplicates = new List<int>() { 1, 2, 3, 4, 5, 5 };
        //    ed.AddTriangleTestExperimentalDesignRows(listSubjectCodes, listProductCodes, listCombinations, listReplicates);
        //    return ed;
        //}

        //public void RemoveTriangleTestExperimentalDesignRows(List<string> listProductCodes = null, List<string> listCombinations = null)
        //{
        //    try
        //    {
        //        List<string> listCodes = new List<string>();

        //        if (listProductCodes != null)
        //        {
        //            listCodes = listProductCodes;
        //        }

        //        if (listCombinations != null)
        //        {
        //            listCodes = listCombinations;
        //        }

        //        foreach (string code in listCodes)
        //        {
        //            List<ExperimentalDesignRow> rowToDelete = new List<ExperimentalDesignRow>();
        //            List<ExperimentalDesignRow> rowToReplace = new List<ExperimentalDesignRow>();

        //            if (listProductCodes != null)
        //            {
        //                rowToDelete = (from x in this.ListExperimentalDesignRows
        //                               where ((TriangleTestExperimentalDesignRow)x).GetPair() == code
        //                               select x).ToList();
        //            }

        //            if (listCombinations != null)
        //            {
        //                rowToReplace = (from x in this.ListExperimentalDesignRows
        //                                where ((TriangleTestExperimentalDesignRow)x).Combination == code
        //                                select x).ToList();
        //            }

        //            foreach (ExperimentalDesignRow row in rowToDelete)
        //            {
        //                // MAJ des rangs
        //                List<ExperimentalDesignRow> rowToUpdate = new List<ExperimentalDesignRow>();

        //                rowToUpdate = (from x in this.ListExperimentalDesignRows
        //                               where x.SubjectCode == row.SubjectCode
        //                               && x.Rank > row.Rank
        //                               select x).ToList();

        //                foreach (ExperimentalDesignRow row1 in rowToUpdate)
        //                {
        //                    row1.Rank--;
        //                }

        //                this.ListExperimentalDesignRows.Remove(row);
        //            }

        //            foreach (TriangleTestExperimentalDesignRow row in rowToReplace)
        //            {
        //                var combis = (from x in this.ListExperimentalDesignRows
        //                              where ((TriangleTestExperimentalDesignRow)x).Combination != row.Combination
        //                              select ((TriangleTestExperimentalDesignRow)x).Combination).Distinct().ToList();

        //                // Nouvelle combinaison parmi les combinaisons restantes
        //                List<ProductTriangle> triangles = ProductTriangle.GenerateAllProductTriangles(row.ProductCode1, row.ProductCode2, combis);
        //                triangles = triangles.OrderBy(a => Guid.NewGuid()).ToList();

        //                row.Combination = triangles.First().Combination;
        //                row.ProductCode1 = triangles.First().ProductCode1;
        //                row.ProductCode2 = triangles.First().ProductCode2;
        //                row.ProductCode3 = triangles.First().ProductCode3;
        //                row.ProductLabel1 = row.ProductCode1;
        //                row.ProductLabel2 = row.ProductCode2;
        //                row.ProductLabel3 = row.ProductCode3;

        //            }
        //        }

        //        HasChanges = true;
        //    }
        //    catch
        //    {
        //    }
        //}

        /// <summary>
        /// Ajoute des lignes (ordre : fixe) à un plan de présentation des produits
        /// </summary>
        /// <param name="listSubjectCodes"></param>
        /// <param name="listProductCodes"></param>
        /// <param name="nbReplicates"></param>
        //public void AddTriangleTestExperimentalDesignRows(List<string> listSubjectCodes = null, List<KeyValuePair<string, string>> listProductCodes = null, List<string> listCombinations = null, List<int> listReplicates = null, bool resetRanks = false, int uploadId = 1)
        //{
        //    if (this.Type != TypeEnum.TriangleTest.ToString())
        //    {
        //        return;
        //    }

        //    if (listSubjectCodes == null)
        //    {
        //        listSubjectCodes = this.GetListSubjectCodes();
        //    }

        //    if (listProductCodes == null)
        //    {
        //        listProductCodes = this.GetListProductTrianglesLabels();
        //    }

        //    if (listCombinations == null)
        //    {
        //        listCombinations = (from x in this.ListExperimentalDesignRows
        //                            select ((TriangleTestExperimentalDesignRow)x).Combination).Distinct().ToList();
        //    }

        //    if (listReplicates == null)
        //    {
        //        listReplicates = this.GetListReplicates();
        //    }

        //    foreach (string subjectCode in listSubjectCodes)
        //    {
        //        int maxRank = 1;
        //        if (this.ListExperimentalDesignRows.Count > 0 && resetRanks == false)
        //        {
        //            //maxRank = (from x in this.ListExperimentalDesignRows
        //            //           select x.Rank).Max() + 1;
        //            var list = (from x in this.ListExperimentalDesignRows
        //                        where x.SubjectCode == subjectCode
        //                        select x);
        //            if (list.Count() > 0)
        //            {
        //                maxRank = (from x in list
        //                           select x.Rank).Max() + 1;
        //            }
        //            //else
        //            //{
        //            //maxRank = (from x in this.ListExperimentalDesignRows
        //            //       select x.Rank).Max() + 1;
        //            //}
        //        }
        //        foreach (KeyValuePair<string, string> kvp in listProductCodes)
        //        {
        //            string[] tab = kvp.Key.Split('|');
        //            ProductPair pair = new ProductPair(tab[0], tab[1]);

        //            // Triangles
        //            List<ProductTriangle> triangles = ProductTriangle.GenerateAllProductTriangles(pair.ProductCode1, pair.ProductCode2, listCombinations);

        //            // Randomisation des lignes du triangle
        //            // TODO : assurer ici que toutes les paires soient vus, et si possible même nombre de fois
        //            triangles = triangles.OrderBy(a => Guid.NewGuid()).ToList();

        //            // Sélection du nombre de triangles (si rép > 6)
        //            int nbTriangles = listReplicates.Count / triangles.Count;
        //            for (int i = 1; i < nbTriangles; i++)
        //            {
        //                List<ProductTriangle> newTriangle = ProductTriangle.GenerateAllProductTriangles(pair.ProductCode1, pair.ProductCode2, listCombinations);
        //                newTriangle = newTriangle.OrderBy(a => Guid.NewGuid()).ToList();
        //                triangles = triangles.Union(newTriangle).ToList();
        //            }
        //            triangles = triangles.Take(listReplicates.Count).ToList();

        //            // Sélection des lignes
        //            int rep = 1;
        //            foreach (ProductTriangle triangle in triangles)
        //            {
        //                TriangleTestExperimentalDesignRow row = new TriangleTestExperimentalDesignRow();
        //                row.Combination = triangle.Combination;
        //                row.SubjectCode = subjectCode;
        //                row.Replicate = rep;
        //                row.Rank = maxRank;
        //                row.UploadId = uploadId;
        //                row.ProductCode1 = triangle.ProductCode1;
        //                row.ProductLabel1 = triangle.ProductCode1;
        //                row.ProductCode2 = triangle.ProductCode2;
        //                row.ProductLabel2 = triangle.ProductCode2;
        //                row.ProductCode3 = triangle.ProductCode3;
        //                row.ProductLabel3 = triangle.ProductCode3;
        //                this.ListExperimentalDesignRows.Add(row);
        //                maxRank++;
        //                rep++;
        //            }
        //        }
        //    }
        //    HasChanges = true;
        //}

        #endregion

        #region Product

        private ObservableCollection<ProductExperimentalDesignRow> getOldListProductExperimentalDesignRow()
        {
            try
            {
                ObservableCollection<ProductExperimentalDesignRow> list = new ObservableCollection<ProductExperimentalDesignRow>();
                foreach (ProductExperimentalDesignRow row in this.ListExperimentalDesignRows)
                {
                    ProductExperimentalDesignRow newRow = new ProductExperimentalDesignRow();
                    newRow.ProductCode = row.ProductCode;
                    newRow.ProductLabel = row.ProductLabel;
                    newRow.Replicate = row.Replicate;
                    newRow.SubjectCode = row.SubjectCode;
                    newRow.Rank = row.Rank;
                    newRow.UploadId = row.UploadId;
                    list.Add(newRow);
                }
                return list;
            }
            catch
            {
                return null;
            }
        }

        //private ObservableCollection<TriangleTestExperimentalDesignRow> getOldListTriangleTestExperimentalDesignRow()
        //{
        //    try
        //    {
        //        ObservableCollection<TriangleTestExperimentalDesignRow> list = new ObservableCollection<TriangleTestExperimentalDesignRow>();
        //        foreach (TriangleTestExperimentalDesignRow row in this.ListExperimentalDesignRows)
        //        {
        //            TriangleTestExperimentalDesignRow newRow = new TriangleTestExperimentalDesignRow();
        //            newRow.ProductCode1 = row.ProductCode1;
        //            newRow.ProductCode2 = row.ProductCode2;
        //            newRow.ProductCode3 = row.ProductCode3;
        //            newRow.ProductLabel1 = row.ProductLabel1;
        //            newRow.ProductLabel2 = row.ProductLabel2;
        //            newRow.ProductLabel2 = row.ProductLabel2;
        //            newRow.Replicate = row.Replicate;
        //            newRow.SubjectCode = row.SubjectCode;
        //            newRow.Rank = row.Rank;
        //            newRow.UploadId = row.UploadId;
        //            list.Add(newRow);
        //        }
        //        return list;
        //    }
        //    catch
        //    {
        //        return null;
        //    }
        //}


        /// <summary>
        /// Génère un plan de présentation de produits
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="listSubjectCodes"></param>
        /// <param name="listProductCodes"></param>
        /// <returns></returns>
        public void CreateProductExperimentalDesign(List<string> listSubjectCodes)
        {
            ObservableCollection<ProductExperimentalDesignRow> copy = getOldListProductExperimentalDesignRow(); ;

            if (this.Order == "Custom")
            {
                setCustomListItemRanks();
            }
            this.ListExperimentalDesignRows = new ObservableCollection<ExperimentalDesignRow>();

            foreach (string subjectCode in listSubjectCodes)
            {
                foreach (ItemLabel item in this.ListItemLabels)
                {
                    ProductExperimentalDesignRow row = new ProductExperimentalDesignRow();
                    row.SubjectCode = subjectCode;
                    row.Replicate = item.Replicate;
                    row.ProductCode = item.Code;
                    row.ProductLabel = item.Label;
                    int rank = item.DefaultRank;
                    int uploadId = 1;
                    if (copy != null)
                    {
                        var rankUpload = (from x in copy
                                          where x.SubjectCode == subjectCode
                                          && x.Replicate == item.Replicate
                                          && x.ProductCode == item.Code
                                          && x.ProductLabel == item.Label
                                          select new { Rank = x.Rank, UploadId = x.UploadId });
                        if (rankUpload.Count() > 0)
                        {
                            rank = rankUpload.First().Rank;
                            uploadId = rankUpload.First().UploadId;
                        }
                    }

                    row.Rank = rank;
                    row.UploadId = uploadId;
                    this.ListExperimentalDesignRows.Add(row);
                }
            }
        }

        /// <summary>
        /// Remplace un code produit par un autre dans ListExperimentalDesignRows (plan de présentation de type Product)
        /// </summary>
        /// <param name="oldCode"></param>
        /// <param name="newCode"></param>
        public void UpdateProductCode(string oldCode, string newCode)
        {
            if (this.Type == TypeEnum.Product.ToString())
            {
                var items = (from x in ListItemLabels
                             where x.Code == oldCode
                             select x);
                foreach (ItemLabel item in items)
                {
                    item.Code = newCode;
                }

                var rows = (from x in ListExperimentalDesignRows
                            where ((ProductExperimentalDesignRow)x).ProductCode == oldCode
                            select x);
                foreach (ProductExperimentalDesignRow row in rows)
                {
                    row.ProductCode = newCode;
                }
            }

            if (this.Type == TypeEnum.TriangleTest.ToString())
            {
                foreach (ItemLabel il in ListItemLabels)
                {
                    string[] codes = il.Code.Split('|');
                    if (codes[0] == oldCode)
                    {
                        il.Code = newCode + "|" + codes[1];
                    }
                    if (codes[1] == oldCode)
                    {
                        il.Code = codes[0] + "|" + newCode;
                    }
                }

                var rows = (from x in ListExperimentalDesignRows
                            where ((TriangleTestExperimentalDesignRow)x).ProductCode1 == oldCode
                            select x);
                foreach (TriangleTestExperimentalDesignRow row in rows)
                {
                    row.ProductCode1 = newCode;
                }
                rows = (from x in ListExperimentalDesignRows
                        where ((TriangleTestExperimentalDesignRow)x).ProductCode2 == oldCode
                        select x);
                foreach (TriangleTestExperimentalDesignRow row in rows)
                {
                    row.ProductCode2 = newCode;
                }
                rows = (from x in ListExperimentalDesignRows
                        where ((TriangleTestExperimentalDesignRow)x).ProductCode3 == oldCode
                        select x);
                foreach (TriangleTestExperimentalDesignRow row in rows)
                {
                    row.ProductCode3 = newCode;
                }

            }
        }

        public bool ContainsAttribute(string code)
        {
            if (this.Type == "Attribute")
            {
                return ((from x in this.ListItemLabels
                         where x.Code == code
                         select x).Count() > 0);
            }
            return false;
        }

        public bool ContainsProduct(string code)
        {
            if (this.Type == "Product" || this.Type == "TriangleTest")
            {
                return ((from x in this.ListItemLabels
                         where x.Code == code
                         select x).Count() > 0);
            }
            return false;
        }

        public bool CheckProductRankUnique()
        {
            foreach (string subject in GetListSubjectCodes())
            {
                foreach (string product in GetListProductCodes())
                {
                    foreach (int rep in GetListReplicates())
                    {
                        var nbRows = (from x in ListExperimentalDesignRows
                                      where x.SubjectCode == subject
                                      && x.Replicate == rep
                                      && ((ProductExperimentalDesignRow)x).ProductCode == product
                                      select x).Count();
                        if (nbRows != 1)
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        #endregion

        #region Attribute

        public void CreateAttributeExperimentalDesign(List<string> listSubjectCodes)
        {
            this.ListExperimentalDesignRows = new ObservableCollection<ExperimentalDesignRow>();
            foreach (string subjectCode in listSubjectCodes)
            {
                foreach (ItemLabel item in this.ListItemLabels)
                {
                    // Création de la ligne si elle n'existe pas déjà
                    AttributeExperimentalDesignRow row = new AttributeExperimentalDesignRow();
                    row.SubjectCode = subjectCode;
                    row.Replicate = item.Replicate;
                    row.AttributeCode = item.Code;
                    row.AttributeLabel = item.Label;
                    row.Rank = item.DefaultRank;
                    row.UploadId = 1;
                    this.ListExperimentalDesignRows.Add(row);
                }
            }
        }

        public bool CheckAttributeRankUnique()
        {
            foreach (string subject in GetListSubjectCodes())
            {
                foreach (string attribute in GetListAttributeCodes())
                {
                    foreach (int rep in GetListReplicates())
                    {
                        var nbRows = (from x in ListExperimentalDesignRows
                                      where x.SubjectCode == subject
                                      && x.Replicate == rep
                                      && ((AttributeExperimentalDesignRow)x).AttributeCode == attribute
                                      select x).Count();
                        if (nbRows != 1)
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }


        /// <summary>
        /// Remplace un code attribut par un autre dans ListExperimentalDesignRows (plan de présentation de type Attribute)
        /// </summary>
        /// <param name="oldCode"></param>
        /// <param name="newCode"></param>
        public void UpdateAttributeCode(string oldCode, string newCode)
        {
            if (this.Type == TypeEnum.Attribute.ToString())
            {
                var items = (from x in ListItemLabels
                             where x.Code == oldCode
                             select x);
                foreach (ItemLabel item in items)
                {
                    item.Code = newCode;
                }

                var rows = (from x in ListExperimentalDesignRows
                            where ((AttributeExperimentalDesignRow)x).AttributeCode == oldCode
                            select x);
                foreach (AttributeExperimentalDesignRow row in rows)
                {
                    row.AttributeCode = newCode;
                }
            }
        }

        public void UpdateAttributeLabel(string code, string newLabel)
        {
            if (this.Type == TypeEnum.Attribute.ToString())
            {
                var items = (from x in ListItemLabels
                             where x.Code == code
                             select x);
                foreach (ItemLabel item in items)
                {
                    item.Label = newLabel;
                }

                var rows = (from x in ListExperimentalDesignRows
                            where ((AttributeExperimentalDesignRow)x).AttributeCode == code
                            select x);
                foreach (AttributeExperimentalDesignRow row in rows)
                {
                    row.AttributeLabel = newLabel;
                }
            }
        }

        #endregion

        #region ProductPairs

        /// <summary>
        /// Génère toutes les paires de produits possibles
        /// </summary>
        /// <param name="listProductCodes"></param>
        /// <returns></returns>
        public static List<ProductPair> GenerateAllProductPairs(List<string> listProductCodes)
        {
            List<ProductPair> list = new List<ProductPair>();
            for (int i = 0; i < listProductCodes.Count - 1; ++i)
            {
                for (int j = i + 1; j < listProductCodes.Count; ++j)
                {
                    list.Add(new ProductPair(listProductCodes[i], listProductCodes[j]));
                }
            }
            return list;
        }

        public class IntIntPair
        {
            public int I1 { get; set; }
            public int I2 { get; set; }
            public IntIntPair(int i1, int i2)
            {
                I1 = i1;
                I2 = i2;
            }
        }

        public static List<IntIntPair> GenerateAllIntIntPairs(int number)
        {
            List<IntIntPair> list = new List<IntIntPair>();
            for (int i = 1; i <= number; ++i)
            {
                for (int j = i + 1; j <= number; ++j)
                {
                    list.Add(new IntIntPair(i, j));
                }
            }
            return list;
        }

        #endregion

        public List<KeyValuePair<string, string>> GetListProductCodesLabels()
        {
            try
            {
                if (Type == "Product")
                {
                    return (from x in ListExperimentalDesignRows
                            select new KeyValuePair<string, string>((x as ProductExperimentalDesignRow).ProductCode, (x as ProductExperimentalDesignRow).ProductLabel)).Distinct().ToList();
                }
                if (Type == "TriangleTest")
                {
                    List<KeyValuePair<string, string>> list1 = (from x in ListExperimentalDesignRows
                                                                select new KeyValuePair<string, string>((x as TriangleTestExperimentalDesignRow).ProductCode1, (x as TriangleTestExperimentalDesignRow).ProductLabel1)).ToList();
                    List<KeyValuePair<string, string>> list2 = (from x in ListExperimentalDesignRows
                                                                select new KeyValuePair<string, string>((x as TriangleTestExperimentalDesignRow).ProductCode2, (x as TriangleTestExperimentalDesignRow).ProductLabel2)).ToList();
                    List<KeyValuePair<string, string>> list3 = (from x in ListExperimentalDesignRows
                                                                select new KeyValuePair<string, string>((x as TriangleTestExperimentalDesignRow).ProductCode3, (x as TriangleTestExperimentalDesignRow).ProductLabel3)).ToList();
                    return list1.Union(list2).Union(list3).Distinct().ToList();

                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public List<string> GetListProductCodes()
        {
            try
            {
                if (this.Type == TypeEnum.Product.ToString())
                {
                    return (from x in this.ListExperimentalDesignRows
                            select ((ProductExperimentalDesignRow)x).ProductCode).Distinct().ToList();
                }
                else if (this.Type == TypeEnum.TriangleTest.ToString())
                {
                    var list1 = (from x in this.ListExperimentalDesignRows
                                 select ((TriangleTestExperimentalDesignRow)x).ProductCode1).Distinct().ToList();
                    var list2 = (from x in this.ListExperimentalDesignRows
                                 select ((TriangleTestExperimentalDesignRow)x).ProductCode2).Distinct().ToList();
                    return (list1.Union(list2)).Distinct().ToList();
                }
                else
                {
                    return new List<string>();
                }
            }
            catch
            {
                return null;
            }
        }

        public List<string> GetListAttributeCodes()
        {
            try
            {
                return (from x in this.ListExperimentalDesignRows
                        where x is AttributeExperimentalDesignRow
                        select ((AttributeExperimentalDesignRow)x).AttributeCode).Distinct().ToList();
            }
            catch
            {
                return null;
            }
        }

        public List<KeyValuePair<string, string>> GetListAttributeCodesLabels()
        {
            try
            {
                return (from x in ListExperimentalDesignRows
                        select new KeyValuePair<string, string>((x as AttributeExperimentalDesignRow).AttributeCode, (x as AttributeExperimentalDesignRow).AttributeLabel)).Distinct().ToList();
            }
            catch
            {
                return null;
            }
        }

        public List<string> GetListSubjectCodes()
        {
            try
            {
                return (from x in ListExperimentalDesignRows
                        select x.SubjectCode).Distinct().ToList();
            }
            catch
            {
                return null;
            }
        }

        public List<string> GetListItems()
        {
            if (this.Type == "Product")
            {
                return GetListProductCodes();
            }
            if (this.Type == "Attribute")
            {
                return GetListAttributeCodes();
            }
            if (this.Type == "TriangleTest")
            {
                List<ProductPair> listPP = GenerateAllProductPairs(GetListProductCodes());
                List<string> list = new List<string>();
                foreach (ProductPair pp in listPP)
                {
                    list.Add(pp.GetPair());
                }
                return list;
            }
            return null;
        }

        public List<int> GetListReplicates()
        {
            return (from x in ListExperimentalDesignRows
                    select x.Replicate).Distinct().OrderBy(x => x).ToList();
        }

        public List<int> GetListProductRanks()
        {
            try
            {
                return (from x in ListExperimentalDesignRows
                        select x.Rank).Distinct().ToList();
            }
            catch
            {
                return null;
            }
        }

        public List<int> GetListBlocks()
        {
            return (from x in ListExperimentalDesignRows
                    where x.UploadId > 0
                    select x.UploadId).Distinct().OrderBy(x => x).ToList();
        }




        /// <summary>
        /// Remplace un code sujet par un autre dans ListExperimentalDesignRows
        /// </summary>
        /// <param name="oldCode"></param>
        /// <param name="newCode"></param>
        public void UpdateSubjectCode(string oldCode, string newCode)
        {
            var rows = (from x in ListExperimentalDesignRows
                        where x.SubjectCode == oldCode
                        select x);
            foreach (ExperimentalDesignRow row in rows)
            {
                row.SubjectCode = newCode;
            }
        }


        public static void ShuffleTwoInArray(ref int[,] myArray, int a, int b)
        {
            for (int i = 0; i < myArray.GetLength(0); i++)
            {
                //for (int j = 0; j < myArray.GetLength(0); j++)
                for (int j = 0; j < myArray.GetLength(1); j++)
                {
                    if (myArray[i, j] == a)
                    {
                        myArray[i, j] = b;
                    }
                    else if (myArray[i, j] == b)
                    {
                        myArray[i, j] = a;
                    }
                }
            }
        }

        public int GetProductRank(int replicate, string subjectCode, string productCode)
        {
            try
            {
                bool exists = (from x in this.ListExperimentalDesignRows
                               where x.Replicate == replicate
                               select x).Count() > 0;
                if (!exists)
                {
                    replicate = 1;
                }

                return (from x in this.ListExperimentalDesignRows
                        where x.Replicate == replicate && x.SubjectCode == subjectCode && ((ProductExperimentalDesignRow)x).ProductCode == productCode
                        select x.Rank).First();
            }
            catch
            {
                return 0;
            }
        }

        public int GetAttributeRank(int replicate, string subjectCode, string attributeCode)
        {
            try
            {
                if (subjectCode == null) return 0;
                if (attributeCode == null) return 0;

                bool exists = (from x in this.ListExperimentalDesignRows
                               where x.Replicate == replicate
                               select x).Count() > 0;
                if (!exists)
                {
                    replicate = 1;
                }

                var res = (from x in this.ListExperimentalDesignRows
                           where x.Replicate == replicate && x.SubjectCode == subjectCode && ((AttributeExperimentalDesignRow)x).AttributeCode == attributeCode
                           select x.Rank);
                if (res.Count() > 0)
                {
                    return res.First();
                }
                return 0;
            }
            catch
            {
                return 0;
            }
        }


        private List<string> setWarmup(IEnumerable<ExperimentalDesignRow> rows)
        {
            List<string> warmups = new List<string>();
            if (this.Type == "Product")
            {
                warmups = (from x in ListItemLabels
                           where x.Warmup == true
                           select x.Code).ToList();
                foreach (string code in warmups)
                {
                    rows.Where(x => ((ProductExperimentalDesignRow)x).ProductCode == code).All(x => { x.Rank = 1; return true; });
                }
            }
            return warmups;
        }

        private bool setRandomListExperimentalDesignRows()
        {
            try
            {
                // Générateur aléatoire
                Random rnd = new Random(this.Seed);

                List<int> blocks = GetListBlocks();

                // 1 partition par bloc
                foreach (int blockId in blocks)
                {
                    // Liste des lignes du bloc sélectionné
                    var blockRows = ListExperimentalDesignRows.Where(x => x.UploadId == blockId);

                    // Liste des sujets du bloc sélectionné
                    var listSubjects = (from x in blockRows
                                        select x.SubjectCode).Distinct();

                    //List<int> randomKeys = Enumerable.Range(0, blockRows.Count()).OrderBy(x => rnd.Next()).ToList();

                    //var nbProducts = (from x in blockRows
                    //                     select ((ProductExperimentalDesignRow)x).ProductCode).Distinct().Count();

                    // Différentes permutations possibles
                    //Permutations<int> permutations = new Permutations<int>(getSequence(1,nbProducts));

                    // Choix d'une permutation parmi les permutations possibles
                    //int randomPosition = rnd.Next(0, permutations.Count());
                    //IList<int> selectedPermutation = permutations.ElementAt(randomPosition);

                    //List<string> listPermutations = new List<string>();

                    // Clé de tri aléatoire
                    //int randomKey=0;
                    //List<int> listIndexes = getSequence(0, blockRows.Count()).OrderBy(x => rnd.Next()).ToList();


                    for (int i = 0; i < listSubjects.Count(); i++)
                    {
                        string subjectCode = listSubjects.ElementAt(i);

                        //if (isWithoutReplacement == false)
                        //{
                        //    randomKey = rnd.Next();
                        //}
                        //else
                        //{
                        //    randomKey = randomIndexes.ElementAt(i);
                        //}

                        // Lignes du sujet
                        var rows = (from x in blockRows
                                    where x.SubjectCode == subjectCode
                                    select x);

                        // Gestion du warmup
                        List<string> warmups = setWarmup(rows);

                        if (this.replicateMode == "Successive")
                        {
                            rows = rows.OrderBy(x => x.Replicate).ThenBy(x => rnd.Next());

                            // Rangs conservés entre les réps
                            if (keepRanksBetweenReplicates)
                            {
                                var reps = (from x in rows select x.Replicate).Distinct();
                                if (reps.Count() > 1)
                                {
                                    if (Type == "TriangleTest")
                                    {
                                        var ranks = (from x in rows where x.Replicate == reps.First() select new { Product = ((TriangleTestExperimentalDesignRow)x).GetPair(), Rank = x.Rank });
                                        foreach (ExperimentalDesignRow row in rows.Where(x => x.Replicate != reps.First()))
                                        {
                                            try
                                            {
                                                row.Rank = (from x in ranks
                                                            where x.Product == ((TriangleTestExperimentalDesignRow)row).GetPair()
                                                            select x.Rank).First();
                                            }
                                            catch
                                            {
                                            }
                                        }
                                    }

                                    if (Type == "Product")
                                    {
                                        var ranks = (from x in rows where x.Replicate == reps.First() select new { Product = ((ProductExperimentalDesignRow)x).ProductCode, Rank = x.Rank });
                                        foreach (ExperimentalDesignRow row in rows.Where(x => x.Replicate != reps.First()))
                                        {
                                            try
                                            {
                                                row.Rank = (from x in ranks
                                                            where x.Product == ((ProductExperimentalDesignRow)row).ProductCode
                                                            select x.Rank).First();
                                            }
                                            catch
                                            {
                                            }
                                        }
                                    }
                                    if (Type == "Attribute")
                                    {
                                        var ranks = (from x in rows where x.Replicate == reps.First() select new { Attribute = ((AttributeExperimentalDesignRow)x).AttributeCode, Rank = x.Rank });
                                        foreach (ExperimentalDesignRow row in rows.Where(x => x.Replicate != reps.First()))
                                        {
                                            try
                                            {
                                                row.Rank = (from x in ranks
                                                            where x.Attribute == ((AttributeExperimentalDesignRow)row).AttributeCode
                                                            select x.Rank).First();
                                            }
                                            catch
                                            {
                                            }
                                        }
                                    }
                                }
                                rows = rows.OrderBy(x => x.Replicate).ThenBy(x => x.Rank);
                            }
                        }
                        if (this.replicateMode == "Sequential")
                        {
                            if (Type == "TriangleTest")
                            {
                                var products = (from x in rows
                                                select ((TriangleTestExperimentalDesignRow)x).GetPair()).Distinct().OrderBy(x => rnd.Next()).ToList();
                                var pr = from x in products
                                         select new { Product = x, Rank = products.IndexOf(x) };
                                rows = (from x in rows
                                        from y in pr
                                        where ((TriangleTestExperimentalDesignRow)x).GetPair() == y.Product
                                        orderby y.Rank, x.Replicate
                                        select x);
                            }
                            if (Type == "Product")
                            {
                                var products = (from x in rows
                                                select ((ProductExperimentalDesignRow)x).ProductCode).Distinct().OrderBy(x => rnd.Next()).ToList();
                                var pr = from x in products
                                         select new { Product = x, Rank = products.IndexOf(x) };
                                rows = (from x in rows
                                        from y in pr
                                        where ((ProductExperimentalDesignRow)x).ProductCode == y.Product
                                        orderby y.Rank, x.Replicate
                                        select x);
                            }
                            if (Type == "Attribute")
                            {
                                var attributes = (from x in rows
                                                  select ((AttributeExperimentalDesignRow)x).AttributeCode).Distinct().OrderBy(x => rnd.Next()).ToList();
                                var pr = from x in attributes
                                         select new { Attribute = x, Rank = attributes.IndexOf(x) };
                                rows = (from x in rows
                                        from y in pr
                                        where ((AttributeExperimentalDesignRow)x).AttributeCode == y.Attribute
                                        orderby y.Rank, x.Replicate
                                        select x);
                            }
                        }
                        if (this.replicateMode == "Shuffle")
                        {
                            rows = rows.OrderBy(x => rnd.Next());
                        }

                        // Nouveau rang
                        //int newRank = 1;
                        //rows.All(x => { x.Rank = newRank; newRank++; setRankAndLabel(x); return true; });

                        int newRank = warmups.Count + 1;
                        if (Type == "Product")
                        {
                            rows.Where(x => !warmups.Contains(((ProductExperimentalDesignRow)x).ProductCode)).All(x => { x.Rank = newRank; newRank++; setRankAndLabel(x); return true; });
                        }
                        else
                        {
                            rows.All(x => { x.Rank = newRank; newRank++; setRankAndLabel(x); return true; });
                        }


                        // Liste de répétitions consécutives
                        if (noConsecutiveItems == true)
                        {
                            List<IntIntPair> listPairs = getListSuccessiveReplicates();
                            foreach (IntIntPair pair in listPairs)
                            {
                                var row1 = (from x in rows
                                            where x.Replicate == pair.I1
                                            orderby x.Rank
                                            select x).Last();
                                var row2 = (from x in rows
                                            where x.Replicate == pair.I2
                                            orderby x.Rank
                                            select x).First();
                                string first = GetExperimentalDesignRowCode(row1);
                                string next = GetExperimentalDesignRowCode(row2);
                                if (first == next)
                                {
                                    var rows3 = (from x in rows
                                                 where x.Replicate == pair.I2
                                                 orderby x.Rank
                                                 select x);
                                    if (rows3.Count() > 1)
                                    {
                                        var row4 = rows3.ElementAt(1);
                                        SwitchRanks(row2, row4);
                                    }
                                }
                            }
                        }




                        //rows.All(x => { setRankAndLabel(x); return true; });

                        //listPermutations.Add(permutation);

                        // Différentes permutations possibles
                        //var nbRanks = rows.Count();
                        //var ranks = getSequence(newRank, nbRanks);
                        //Permutations<int> permutations = new Permutations<int>(ranks);

                        // Choix d'une permutation parmi les permutations possibles
                        //int randomPosition = rnd.Next(0, permutations.Count());
                        //IList<int> selectedPermutation = permutations.ElementAt(randomPosition);

                        //if (isWithoutReplacement == true)
                        //{
                        //    //// Tirage sans remise : on supprime la permutation
                        //    //permutations.ElementAt(randomPosition).Clear();
                        //    //if (permutations.Count == 0)
                        //    //{
                        //    //    permutations = new Permutations<int>(ranks);
                        //    //}
                        //}
                    }
                }



                return true;
            }
            catch
            {
                return false;
            }
        }

        private List<IntIntPair> getListSuccessiveReplicates()
        {
            List<IntIntPair> listPairs = new List<IntIntPair>();
            for (int replicate = 1; replicate < this.NbReplicates; replicate++)
            {
                listPairs.Add(new IntIntPair(replicate, replicate + 1));
            }
            return listPairs;
        }

        //private List<ExperimentalDesignRow> getConsecutiveItemsBetweenReplicates()
        //{
        //    List<ExperimentalDesignRow> list = new List<ExperimentalDesignRow>();

        //    // Liste de répétitions consécutives
        //    List<IntIntPair> listPairs = new List<IntIntPair>();
        //    for (int replicate = 1; replicate < this.NbReplicates ; replicate++)
        //    {
        //        listPairs.Add(new IntIntPair(replicate, replicate + 1));
        //    }

        //    var codes = (from x in this.ListItemLabels
        //                 select x.Code).Distinct();

        //    // Pour chaque répétition consécutive
        //    foreach (IntIntPair pair in listPairs)
        //    {
        //        var lastRank1 = (from x in this.listExperimentalDesignRows
        //                         where x.Replicate == pair.I1
        //                         select x.Rank).Max();
        //        var lastRank2 = (from x in this.listExperimentalDesignRows
        //                         where x.Replicate == pair.I2
        //                         select x.Rank).Min();

        //        foreach (string subject in this.GetListSubjectCodes())
        //        {
        //            foreach (string code in codes)
        //            {
        //                var rows1 = (from x in this.listExperimentalDesignRows
        //                             where x.SubjectCode == subject
        //                             && x.Rank == lastRank1
        //                             && GetExperimentalDesignRowCode(x) == code
        //                             select x);
        //                var rows2 = (from x in this.listExperimentalDesignRows
        //                             where x.SubjectCode == subject
        //                             && x.Rank == lastRank2
        //                             && GetExperimentalDesignRowCode(x) == code
        //                             select x);
        //                if (rows1.Count() > 0 && rows2.Count() > 0)
        //                {
        //                    string s = rows1.First().SubjectCode;
        //                }
        //            }
        //        }
        //    }

        //    return list;
        //}

        private bool setCustomListExperimentalDesignRows()
        {
            try
            {
                List<int> blocks = GetListBlocks();

                // 1 partition par bloc
                foreach (int blockId in blocks)
                {
                    // Liste des lignes du bloc sélectionné
                    var blockRows = ListExperimentalDesignRows.Where(x => x.UploadId == blockId);

                    // Liste des sujets du bloc sélectionné
                    var listSubjects = (from x in blockRows
                                        select x.SubjectCode).Distinct();

                    for (int i = 0; i < listSubjects.Count(); i++)
                    {
                        string subjectCode = listSubjects.ElementAt(i);

                        // Lignes du sujet
                        var rows = (from x in blockRows
                                    where x.SubjectCode == subjectCode
                                    select x);

                        // Affecte les rangs et les labels en fonction de ListItemLabels
                        rows.All(x => { setRankAndLabel(x); return true; });
                    }
                }
            }
            catch
            {
            }
            return true;
        }

        private bool setFixedListExperimentalDesignRows()
        {
            try
            {
                //TODO : order par DefaultRank
                //setListItemRanks();

                List<int> blocks = GetListBlocks();

                // 1 partition par bloc
                foreach (int blockId in blocks)
                {
                    // Liste des lignes du bloc sélectionné
                    var blockRows = ListExperimentalDesignRows.Where(x => x.UploadId == blockId);

                    // Liste des sujets du bloc sélectionné
                    var listSubjects = (from x in blockRows
                                        select x.SubjectCode).Distinct();

                    for (int i = 0; i < listSubjects.Count(); i++)
                    {
                        string subjectCode = listSubjects.ElementAt(i);
                        int newRank = 1;

                        // Lignes du sujet
                        var rows = (from x in blockRows
                                    where x.SubjectCode == subjectCode
                                    select x);

                        // Affecte les rangs et les labels en fonction de ListItemLabels
                        rows.All(x => { setRankAndLabel(x); return true; });

                        //if (this.replicateMode == "Successive")
                        //{
                        //    //rows = rows.OrderBy(x => x.Replicate);
                        //    rows = rows.OrderBy(x => x.Replicate).ThenBy(x=>x.Rank);
                        //}
                        //if (this.replicateMode == "Sequential")
                        //{
                        //    if (Type == "Product")
                        //    {
                        //        //rows = rows.OrderBy(x => ((ProductExperimentalDesignRow)x).ProductCode).ThenBy(x => x.Replicate);
                        //        rows = rows.OrderBy(x=>x.Rank).ThenBy(x => ((ProductExperimentalDesignRow)x).ProductCode).ThenBy(x => x.Replicate);
                        //    }
                        //    if (Type == "Attribute")
                        //    {
                        //        rows = rows.OrderBy(x => ((AttributeExperimentalDesignRow)x).AttributeCode).ThenBy(x => x.Replicate);
                        //    }
                        //}
                        //// Shuffle = Successive

                        //// Nouveau rang
                        //rows.All(x => { x.Rank = newRank; newRank++; return true; });

                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        private void setRankAndLabel(ExperimentalDesignRow row)
        {
            try
            {
                string code = "";
                if (row is ProductExperimentalDesignRow)
                {
                    code = ((ProductExperimentalDesignRow)row).ProductCode;
                }
                if (row is AttributeExperimentalDesignRow)
                {
                    code = ((AttributeExperimentalDesignRow)row).AttributeCode;
                }
                if (row is TriangleTestExperimentalDesignRow)
                {
                    code = ((TriangleTestExperimentalDesignRow)row).GetPair();
                }
                var items = (from x in this.ListItemLabels
                             where x.Code == code && x.Replicate == row.Replicate
                             select x);
                if (items.Count() > 0)
                {
                    if (this.IsFixedOrder)
                    {
                        row.Rank = items.First().DefaultRank;
                    }
                    if (row is ProductExperimentalDesignRow)
                    {
                        ((ProductExperimentalDesignRow)row).ProductLabel = items.First().Label;
                    }
                    if (row is AttributeExperimentalDesignRow)
                    {
                        ((AttributeExperimentalDesignRow)row).AttributeLabel = items.First().Label;
                    }
                    if (row is TriangleTestExperimentalDesignRow)
                    {
                        // labelP1-1|labelP1-2|labelP2-1|labelP2-2
                        string[] labels = items.First().Label.Split('|');
                        string[] codes = items.First().Code.Split('|');
                        try
                        {
                            ((TriangleTestExperimentalDesignRow)row).SetLabels(labels);
                            //if (((TriangleTestExperimentalDesignRow)row).Combination == "AAB")
                            //{
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel1 = labels[0];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel2 = labels[1];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel3 = labels[2];
                            //}
                            //if (((TriangleTestExperimentalDesignRow)row).Combination == "ABA")
                            //{
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel1 = labels[0];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel2 = labels[2];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel3 = labels[1];
                            //}
                            //if (((TriangleTestExperimentalDesignRow)row).Combination == "BAA")
                            //{
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel1 = labels[2];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel2 = labels[0];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel3 = labels[1];
                            //}
                            //if (((TriangleTestExperimentalDesignRow)row).Combination == "ABB")
                            //{
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel1 = labels[0];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel2 = labels[2];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel3 = labels[3];
                            //}
                            //if (((TriangleTestExperimentalDesignRow)row).Combination == "BBA")
                            //{
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel1 = labels[2];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel2 = labels[3];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel3 = labels[0];
                            //}
                            //if (((TriangleTestExperimentalDesignRow)row).Combination == "BAB")
                            //{
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel1 = labels[2];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel2 = labels[0];
                            //    ((TriangleTestExperimentalDesignRow)row).ProductLabel3 = labels[3];
                            //}


                        }
                        catch
                        { }
                    }
                }
                //OnChanged(EventArgs.Empty);
            }
            catch
            {
            }
        }

        public List<int> GetAuthorizedRanksForReplicate(int rep)
        {
            try
            {
                if (this.IsSequentialReplicateMode)
                {
                    return ((from x in this.ListItemLabels
                             where x.Replicate == 1
                             orderby x.DefaultRank
                             select x.DefaultRank).ToList());
                }
                else if (this.IsSuccessiveReplicateMode)
                {
                    return ((from x in this.ListItemLabels
                             where x.Replicate == rep
                             orderby x.DefaultRank
                             select x.DefaultRank).ToList());
                }
                else
                {
                    return ((from x in this.ListItemLabels
                             orderby x.DefaultRank
                             select x.DefaultRank).ToList());
                }
            }
            catch
            {
                return new List<int>();
            }
        }

        public class Permutation
        {

            public static IEnumerable<T[]> GetPermutations<T>(T[] items)
            {
                int[] work = new int[items.Length];
                for (int i = 0; i < work.Length; i++)
                {
                    work[i] = i;
                }
                foreach (int[] index in GetIntPermutations(work, 0, work.Length))
                {
                    T[] result = new T[index.Length];
                    for (int i = 0; i < index.Length; i++) result[i] = items[index[i]];
                    yield return result;
                }
            }

            public static IEnumerable<int[]> GetIntPermutations(int[] index, int offset, int len)
            {
                if (len == 1)
                {
                    yield return index;
                }
                else if (len == 2)
                {
                    yield return index;
                    Swap(index, offset, offset + 1);
                    yield return index;
                    Swap(index, offset, offset + 1);
                }
                else
                {
                    foreach (int[] result in GetIntPermutations(index, offset + 1, len - 1))
                    {
                        yield return result;
                    }
                    for (int i = 1; i < len; i++)
                    {
                        Swap(index, offset, offset + i);
                        foreach (int[] result in GetIntPermutations(index, offset + 1, len - 1))
                        {
                            yield return result;
                        }
                        Swap(index, offset, offset + i);
                    }
                }
            }

            private static void Swap(int[] index, int offset1, int offset2)
            {
                int temp = index[offset1];
                index[offset1] = index[offset2];
                index[offset2] = temp;
            }

        }




        public void switchBigSquareRows(int[,] a, int indexOne, int indexTwo)
        {
            if (a == null) { throw new ArgumentNullException("a"); }
            if (a.Rank != 2) { throw new InvalidOperationException("b"); }

            // Only support zero based:
            if (a.GetLowerBound(0) != 0) { throw new InvalidOperationException("c"); }
            if (a.GetLowerBound(1) != 0) { throw new InvalidOperationException("d"); }

            int upperBound = a.GetUpperBound(0);

            if (indexOne >= upperBound) { throw new InvalidOperationException("e"); }
            if (indexTwo >= upperBound)
            {
                throw new InvalidOperationException("f");
            }

            for (int i = 0; i <= a.GetUpperBound(1); ++i)
            {
                var t = a[indexOne, i];
                a[indexOne, i] = a[indexTwo, i];
                a[indexTwo, i] = t;
            }
        }



        public void SwitchRanks(ExperimentalDesignRow row1, ExperimentalDesignRow row2)
        {
            try
            {
                if (row1 != null && row2 != null)
                {
                    int memory = row2.Rank;
                    row2.Rank = row1.Rank;
                    row1.Rank = memory;
                }
            }
            catch
            {
            }
        }

        public string GetExperimentalDesignRowLabel(ExperimentalDesignRow row)
        {
            string label = "";
            if (row is ProductExperimentalDesignRow)
            {
                return ((ProductExperimentalDesignRow)row).ProductLabel;
            }
            if (row is AttributeExperimentalDesignRow)
            {
                return ((AttributeExperimentalDesignRow)row).AttributeLabel;
            }
            if (row is TriangleTestExperimentalDesignRow)
            {
                return ((TriangleTestExperimentalDesignRow)row).GetTriangleLabel();
            }
            return label;
        }

        //public void SetExperimentalDesignRowLabel(ExperimentalDesignRow row, string label)
        //{
        //    if (row is ProductExperimentalDesignRow)
        //    {
        //        ((ProductExperimentalDesignRow)row).ProductLabel = label;
        //    }
        //    if (row is AttributeExperimentalDesignRow)
        //    {
        //        ((AttributeExperimentalDesignRow)row).AttributeLabel = label;
        //    }
        //}

        public string GetExperimentalDesignRowCode(ExperimentalDesignRow row)
        {
            string label = "";
            if (row is ProductExperimentalDesignRow)
            {
                return ((ProductExperimentalDesignRow)row).ProductCode;
            }
            if (row is AttributeExperimentalDesignRow)
            {
                return ((AttributeExperimentalDesignRow)row).AttributeCode;
            }
            if (row is TriangleTestExperimentalDesignRow)
            {
                return ((TriangleTestExperimentalDesignRow)row).GetTriangle();
            }
            return label;
        }


        public static string[,] CreateInlineExperimentalDesign(ExperimentalDesign design, bool showLabels = true)
        {
            // Crée une vue inline Block + Juge | Item1 | Item2 | ... ItemN
            // Nombre de lignes : juges
            // Nombre de colonnes : produit (descripteur)
            int nbCols;
            List<string> listSubjects = design.GetListSubjectCodes();
            List<int> listBlocks = design.GetListBlocks();
            List<int> listReplicates = design.GetListReplicates();

            List<string[]> listArrays = new List<string[]>();
            int maxCols = 1;



            // Un tableau par bloc et par rép
            foreach (int block in listBlocks)
            {
                foreach (int rep in listReplicates)
                {
                    foreach (string subject in listSubjects)
                    {
                        nbCols = (from x in design.ListExperimentalDesignRows
                                  where x.UploadId == block && x.Replicate == rep && x.SubjectCode == subject
                                  select x).Count();

                        List<int> listRanks = (from x in design.ListExperimentalDesignRows
                                               where x.UploadId == block && x.Replicate == rep && x.SubjectCode == subject
                                               select x.Rank).Distinct().OrderBy(x => x).ToList();

                        string[] tab = new string[nbCols + 3];

                        if (nbCols > maxCols)
                        {
                            maxCols = nbCols;
                        }

                        tab[0] = block.ToString();
                        tab[1] = rep.ToString();
                        tab[2] = subject;

                        int currentCol = 3;
                        foreach (int rank in listRanks)
                        {
                            try
                            {
                                var rows = (from x in design.ListExperimentalDesignRows
                                            where x.UploadId == block && x.Replicate == rep && x.Rank == rank && x.SubjectCode == subject
                                            select x);
                                if (rows.Count() > 0)
                                {
                                    ExperimentalDesignRow row = rows.First();
                                    if (design.Type == "Product")
                                    {
                                        if (showLabels)
                                        {
                                            tab[currentCol] = ((ProductExperimentalDesignRow)row).ProductLabel;
                                        }
                                        else
                                        {
                                            tab[currentCol] = ((ProductExperimentalDesignRow)row).ProductCode;
                                        }
                                    }
                                    if (design.Type == "Attribute")
                                    {
                                        if (showLabels)
                                        {
                                            tab[currentCol] = ((AttributeExperimentalDesignRow)row).AttributeLabel;
                                        }
                                        else
                                        {
                                            tab[currentCol] = ((AttributeExperimentalDesignRow)row).AttributeCode;
                                        }
                                    }
                                    if (design.Type == "TriangleTest")
                                    {
                                        if (showLabels)
                                        {
                                            tab[currentCol] = ((TriangleTestExperimentalDesignRow)row).GetTriangleLabel();
                                        }
                                        else
                                        {
                                            tab[currentCol] = ((TriangleTestExperimentalDesignRow)row).GetTriangle();
                                        }
                                    }
                                }
                            }
                            catch
                            {
                                tab[currentCol] = "-";
                            }
                            currentCol++;
                        }
                        listArrays.Add(tab);
                    }

                }
            }

            // Un seul tableau
            string[,] bigArray = new string[listArrays.Count, maxCols + 3];

            for (int i = 0; i < listArrays.Count; i++)
            {
                int nbColsInCurrentArray = listArrays[i].GetLength(0);
                for (int j = 0; j < nbColsInCurrentArray; j++)
                {
                    bigArray[i, j] = listArrays[i][j];

                }
            }


            return bigArray;
        }

        public static bool operator ==(ExperimentalDesign a, ExperimentalDesign b)
        {
            // If both are null, or both are same instance, return true.
            if (System.Object.ReferenceEquals(a, b))
            {
                return true;
            }

            // If one is null, but not both, return false.
            if (((object)a == null) || ((object)b == null))
            {
                return false;
            }

            // Return true if the fields match:
            return a.Name == b.Name
                && a.Id == b.Id;
        }

        public static bool operator !=(ExperimentalDesign a, ExperimentalDesign b)
        {
            return !(a == b);
        }

    }

    public class ExperimentalDesignRow
    {
        public string SubjectCode { get; set; }
        public int Replicate { get; set; }
        public int UploadId { get; set; }
        public int Rank { get; set; }
        public string Code { get; set; }
        public string Label { get; set; }

    }


    public class ProductExperimentalDesignRow : ExperimentalDesignRow
    {
        public string ProductCode { get; set; }
        public string ProductLabel { get; set; }
    }

    public class AttributeExperimentalDesignRow : ExperimentalDesignRow
    {
        public string AttributeCode { get; set; }

        public string AttributeLabel { get; set; }
    }

    public class ProductPairExperimentalDesignRow : ExperimentalDesignRow
    {
        public string ProductCode1 { get; set; }
        public string ProductCode2 { get; set; }
    }

    public class TriangleTestExperimentalDesignRow : ExperimentalDesignRow
    {
        public string Combination { get; set; }
        public string ProductCode1 { get; set; }
        public string ProductCode2 { get; set; }
        public string ProductCode3 { get; set; }
        public string ProductLabel1 { get; set; }
        public string ProductLabel2 { get; set; }
        public string ProductLabel3 { get; set; }

        public string GetTriangle()
        {
            return ProductCode1 + "|" + ProductCode2 + "|" + ProductCode3;
        }

        public string GetTriangleLabel()
        {
            return ProductLabel1 + "|" + ProductLabel2 + "|" + ProductLabel3;
        }

        public string GetPair()
        {
            List<string> list = new List<string>() { ProductCode1, ProductCode2, ProductCode3 };
            list = list.Distinct().OrderBy(x => x).ToList();
            if (list.Count > 1)
            {
                return list[0] + "|" + list[1];
            }
            return null;
        }

        public void SetLabels(string[] labels)
        {
            if (labels.Count() != 4)
            {
                return;
            }
            if (Combination == "AAB")
            {
                ProductLabel1 = labels[0];
                ProductLabel2 = labels[1];
                ProductLabel3 = labels[3];
            }
            if (Combination == "ABA")
            {
                ProductLabel1 = labels[0];
                ProductLabel2 = labels[2];
                ProductLabel3 = labels[1];
            }
            if (Combination == "BAA")
            {
                ProductLabel1 = labels[2];
                ProductLabel2 = labels[0];
                ProductLabel3 = labels[1];
            }
            if (Combination == "ABB")
            {
                ProductLabel1 = labels[0];
                ProductLabel2 = labels[2];
                ProductLabel3 = labels[3];
            }
            if (Combination == "BBA")
            {
                ProductLabel1 = labels[2];
                ProductLabel2 = labels[3];
                ProductLabel3 = labels[0];
            }
            if (Combination == "BAB")
            {
                ProductLabel1 = labels[2];
                ProductLabel2 = labels[0];
                ProductLabel3 = labels[3];
            }
        }
    }

    public class ProductPair : INotifyPropertyChanged
    {
        public void OnPropertyChanged(string propertyName)
        {
            this.OnPropertyChanged(new PropertyChangedEventArgs(propertyName));
        }

        protected virtual void OnPropertyChanged(PropertyChangedEventArgs args)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, args);
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        public string ProductCode1 { get; set; }
        public string ProductCode2 { get; set; }

        public ProductPair() { }

        public ProductPair(string p1, string p2)
        {
            if (p1.CompareTo(p2) <= 0)
            {
                ProductCode1 = p1;
                ProductCode2 = p2;
            }
            else
            {
                ProductCode1 = p2;
                ProductCode2 = p1;
            }
            OnPropertyChanged("ProductCode1");
            OnPropertyChanged("ProductCode2");
        }

        public string GetPair()
        {
            return ProductCode1 + "|" + ProductCode2;
        }
    }

    public class ProductPairWithLabels : ProductPair
    {
        public bool Selected { get; set; }
        public int Replicate { get; set; }
        public string LabelProduct1As1 { get; set; }
        public string LabelProduct1As2 { get; set; }
        public string LabelProduct2As1 { get; set; }
        public string LabelProduct2As2 { get; set; }

        public string GetLabel()
        {
            return LabelProduct1As1 + "|" + LabelProduct1As2 + "|" + LabelProduct2As1 + "|" + LabelProduct2As2;
        }
    }

    public class ProductTriangle
    {
        public string Combination { get; set; }
        public string ProductCode1 { get; set; }
        public string ProductCode2 { get; set; }
        public string ProductCode3 { get; set; }
        public string ProductLabel1 { get; set; }
        public string ProductLabel2 { get; set; }
        public string ProductLabel3 { get; set; }

        public static List<string> Combinations = new List<string>() { "AAB", "ABA", "BAA", "BBA", "BAB", "ABB" };

        public ProductTriangle() { }

        public ProductTriangle(string combination, string p1, string p2, string p3, string label1, string label2, string label3)
        {
            Combination = combination;
            ProductCode1 = p1;
            ProductCode2 = p2;
            ProductCode3 = p3;
            ProductLabel1 = label1;
            ProductLabel2 = label2;
            ProductLabel3 = label3;
        }

        public static List<ProductTriangle> GenerateAllProductTriangles(ProductPairWithLabels pp)
        {
            List<ProductTriangle> list = new List<ProductTriangle>();
            list.Add(new ProductTriangle("AAB", pp.ProductCode1, pp.ProductCode1, pp.ProductCode2, pp.LabelProduct1As1, pp.LabelProduct1As2, pp.LabelProduct2As1)); //AAB 
            list.Add(new ProductTriangle("ABA", pp.ProductCode1, pp.ProductCode2, pp.ProductCode1, pp.LabelProduct1As1, pp.LabelProduct2As1, pp.LabelProduct1As2)); //ABA 
            list.Add(new ProductTriangle("BAA", pp.ProductCode2, pp.ProductCode1, pp.ProductCode1, pp.LabelProduct2As1, pp.LabelProduct1As1, pp.LabelProduct1As2)); //BAA 
            list.Add(new ProductTriangle("BBA", pp.ProductCode2, pp.ProductCode2, pp.ProductCode1, pp.LabelProduct2As1, pp.LabelProduct2As2, pp.LabelProduct1As1)); //BBA 
            list.Add(new ProductTriangle("BAB", pp.ProductCode2, pp.ProductCode1, pp.ProductCode2, pp.LabelProduct2As1, pp.LabelProduct1As1, pp.LabelProduct2As2)); //BAB 
            list.Add(new ProductTriangle("ABB", pp.ProductCode1, pp.ProductCode2, pp.ProductCode2, pp.LabelProduct1As1, pp.LabelProduct2As1, pp.LabelProduct2As2)); //ABB 
            return list;
        }

        
    }

    public class ItemLabel : INotifyPropertyChanged
    {
        private string code;
        private int replicate;
        private string label;
        private int defaultRank;
        private bool warmup;

        public string Code
        {
            get { return code; }
            set
            {
                code = value;
                this.OnPropertyChanged("Code");
            }
        }

        public int Replicate
        {
            get { return replicate; }
            set
            {
                replicate = value;
                this.OnPropertyChanged("Replicate");
            }
        }

        public string Label
        {
            get { return label; }
            set
            {
                label = value;
                this.OnPropertyChanged("Label");
            }
        }

        public int DefaultRank
        {
            get { return defaultRank; }
            set
            {
                defaultRank = value;
                this.OnPropertyChanged("DefaultRank");
            }
        }

        public bool Warmup
        {
            get { return warmup; }
            set
            {
                warmup = value;
                this.OnPropertyChanged("Warmup");
            }
        }

        public ItemLabel()
        {
            warmup = false;
        }

        public void OnPropertyChanged(string propertyName)
        {
            this.OnPropertyChanged(new PropertyChangedEventArgs(propertyName));
        }

        protected virtual void OnPropertyChanged(PropertyChangedEventArgs args)
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, args);
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
    }
}