class Numeric
    def round_to( places )
        power = 10.0**places
        (self * power).round / power
    end
end

def item_size(path)
  require 'find'
  size = 0
  
  if File.directory?(path) then
	  Find.find(path) { |f| size += File.size(f) if File.file?(f) }
  end
  
  if File.file?(path) then
  	size = File.size(path)
  end 	
  		  
  return size
end

def has_children?(current_dir)
	
	if not File.file?(current_dir) then
		return ( Dir.entries(current_dir).length > 2 )
	end	
	
	return false
end

@global_id_counter = 0; 

def getFilesList(current_dir, f, level=0, parent_size=0)
	
	size = item_size(current_dir);
	
	percent = 1;

	if level > 0 and parent_size > 0 then 
		percent = ((size.to_f / parent_size))
	end
	
	
	f.puts " "*level + "{"
	f.puts " "*level + " id: \"s_#{@global_id_counter}\","
	
	@global_id_counter += 1
	
	f.puts " "*level + " name: \"#{File.basename(current_dir)}\", "
	f.puts " "*level + " size: #{size},"
	f.puts " "*level + " percent: #{percent}"
	

	 
	if level < 50 then
	
		f.puts " "*level + ", children: [" if has_children?(current_dir) 
		
		if not File.file?(current_dir) then
			Dir.foreach(current_dir) do |item|
			  file_path = current_dir + '/'+item;
				  	
			  if File.directory?(file_path) and item != "." and item != ".." then
				getFilesList(file_path, f, level+1, size)
			  end

			end
		end
		
		if not File.file?(current_dir) then
			Dir.foreach(current_dir) do |item|
				file_path = current_dir + '/'+item;
				if File.file?(file_path) then
					getFilesList(file_path, f, level+1, size)
				end
			end
		end	 
		
		f.puts " "*level + " ]" if has_children?(current_dir) 
	end
	
	f.puts " "*level + "}"
	f.puts "," if level > 0
	
end


f = File.open('./js/data.js', 'w')
f.puts "var data = "
getFilesList("/Users/Evgeniy/Dropbox/Folder 0", f);
f.close()
 


# puts has_children?("/Users/Evgeniy/Dropbox/!Рига")
